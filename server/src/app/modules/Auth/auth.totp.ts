import crypto from 'crypto';
import config from '../../config';

/**
 * TOTP (RFC 6238, the Google Authenticator defaults: SHA-1, 6 digits, 30 s),
 * encryption of the shared secret at rest, and one-time backup codes.
 */

const PERIOD_SECONDS = 30;
const DIGITS = 6;
/** Accept the previous and next step too, to absorb clock drift. */
const WINDOW = 1;
const BASE32 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
/** No 0/O/1/I/L, so codes survive being written down. */
const BACKUP_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
export const BACKUP_CODE_COUNT = 10;

export const base32Encode = (bytes: Buffer) => {
  let bits = '';
  for (const byte of bytes) bits += byte.toString(2).padStart(8, '0');
  let out = '';
  for (let i = 0; i < bits.length; i += 5) {
    out += BASE32[parseInt(bits.slice(i, i + 5).padEnd(5, '0'), 2)];
  }
  return out;
};

export const base32Decode = (text: string) => {
  let bits = '';
  for (const char of text.toUpperCase().replace(/[\s=]/g, '')) {
    const value = BASE32.indexOf(char);
    if (value < 0) throw new Error('Invalid base32 secret');
    bits += value.toString(2).padStart(5, '0');
  }
  const bytes: number[] = [];
  for (let i = 0; i + 8 <= bits.length; i += 8) bytes.push(parseInt(bits.slice(i, i + 8), 2));
  return Buffer.from(bytes);
};

/** 160-bit secret, as recommended by RFC 4226. */
export const generateTotpSecret = () => base32Encode(crypto.randomBytes(20));

export const totpStep = (now = Date.now()) => Math.floor(now / 1000 / PERIOD_SECONDS);

export const totpCode = (secret: string, step: number) => {
  const counter = Buffer.alloc(8);
  counter.writeBigUInt64BE(BigInt(step));
  const digest = crypto.createHmac('sha1', base32Decode(secret)).update(counter).digest();
  const offset = digest[digest.length - 1] & 0x0f;
  const binary = digest.readUInt32BE(offset) & 0x7fffffff;
  return String(binary % 10 ** DIGITS).padStart(DIGITS, '0');
};

const safeEqual = (a: string, b: string) => {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && crypto.timingSafeEqual(left, right);
};

/**
 * Returns the matched time step, or null. Steps at or before `afterStep` are
 * refused, so a code cannot be used twice (replay protection).
 */
export const verifyTotp = (secret: string, code: string, afterStep = 0, now = Date.now()) => {
  if (!/^\d{6}$/.test(code)) return null;
  const current = totpStep(now);
  let matched: number | null = null;
  for (let step = current - WINDOW; step <= current + WINDOW; step++) {
    if (step > afterStep && safeEqual(totpCode(secret, step), code) && matched === null) {
      matched = step;
    }
  }
  return matched;
};

export const otpauthUrl = (secret: string, account: string) => {
  const issuer = config.totp_issuer;
  const label = encodeURIComponent(`${issuer}:${account}`);
  return `otpauth://totp/${label}?secret=${secret}&issuer=${encodeURIComponent(issuer)}&algorithm=SHA1&digits=${DIGITS}&period=${PERIOD_SECONDS}`;
};

const deriveKey = (purpose: string) =>
  Buffer.from(
    crypto.hkdfSync('sha256', String(config.totp_encryption_key), Buffer.alloc(0), purpose, 32),
  );

/** AES-256-GCM, so a database leak alone does not expose authenticator secrets. */
export const encryptSecret = (secret: string) => {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', deriveKey('totp-secret-v1'), iv);
  const data = Buffer.concat([cipher.update(secret, 'utf8'), cipher.final()]);
  return ['v1', iv, cipher.getAuthTag(), data]
    .map((part) => (typeof part === 'string' ? part : part.toString('base64url')))
    .join('.');
};

export const decryptSecret = (stored: string) => {
  const [version, iv, tag, data] = stored.split('.');
  if (version !== 'v1' || !iv || !tag || !data) throw new Error('Unreadable TOTP secret');
  const decipher = crypto.createDecipheriv(
    'aes-256-gcm',
    deriveKey('totp-secret-v1'),
    Buffer.from(iv, 'base64url'),
  );
  decipher.setAuthTag(Buffer.from(tag, 'base64url'));
  return Buffer.concat([decipher.update(Buffer.from(data, 'base64url')), decipher.final()]).toString('utf8');
};

/** Case, spaces and dashes do not matter when a backup code is typed back. */
export const normalizeBackupCode = (code: string) => code.toUpperCase().replace(/[\s-]/g, '');

/** Codes carry ~49 bits of entropy, so a keyed fast hash is enough (no bcrypt needed). */
export const hashBackupCode = (code: string) =>
  crypto.createHmac('sha256', deriveKey('backup-code-v1')).update(normalizeBackupCode(code)).digest('hex');

/** Ten codes shown as XXXXX-XXXXX, plus the hashes to store. */
export const generateBackupCodes = () => {
  const codes = Array.from({ length: BACKUP_CODE_COUNT }, () => {
    let raw = '';
    for (let i = 0; i < 10; i++) raw += BACKUP_ALPHABET[crypto.randomInt(BACKUP_ALPHABET.length)];
    return `${raw.slice(0, 5)}-${raw.slice(5)}`;
  });
  return { codes, hashes: codes.map(hashBackupCode) };
};
