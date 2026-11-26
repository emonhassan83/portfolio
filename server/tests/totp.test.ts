import './helpers';
import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import {
  base32Decode,
  base32Encode,
  decryptSecret,
  encryptSecret,
  generateBackupCodes,
  hashBackupCode,
  totpCode,
  totpStep,
  verifyTotp,
} from '../src/app/modules/Auth/auth.totp';

const RFC_SECRET = base32Encode(Buffer.from('12345678901234567890', 'ascii'));

describe('RFC 6238 SHA-1 vectors (6-digit suffix)', () => {
  const vectors: Array<[number, string]> = [
    [59, '287082'],
    [1111111109, '081804'],
    [1111111111, '050471'],
    [1234567890, '005924'],
    [2000000000, '279037'],
  ];
  for (const [seconds, expected] of vectors) {
    test(`time ${seconds}s produces ${expected}`, () => {
      assert.equal(totpCode(RFC_SECRET, totpStep(seconds * 1000)), expected);
    });
  }
});

describe('base32', () => {
  test('round-trips bytes', () => {
    const bytes = Buffer.from([0, 1, 2, 127, 128, 254, 255, 42, 7, 99]);
    assert.deepEqual(base32Decode(base32Encode(bytes)), bytes);
  });

  test('decoding ignores case, spaces and padding', () => {
    const bytes = Buffer.from('hello world');
    const encoded = base32Encode(bytes);
    assert.deepEqual(base32Decode(` ${encoded.toLowerCase().slice(0, 8)} ${encoded.slice(8)}== `), base32Decode(encoded));
  });

  test('invalid characters throw', () => {
    assert.throws(() => base32Decode('ABC1DEF'), /Invalid base32 secret/);
    assert.throws(() => base32Decode('ABC!DEF'), /Invalid base32 secret/);
  });
});

describe('verifyTotp', () => {
  const secret = RFC_SECRET;
  const now = 1111111111 * 1000;
  const step = totpStep(now);
  const codeAt = (s: number) => totpCode(secret, s);

  test('accepts the current, previous and next step', () => {
    assert.equal(verifyTotp(secret, codeAt(step), 0, now), step);
    assert.equal(verifyTotp(secret, codeAt(step - 1), 0, now), step - 1);
    assert.equal(verifyTotp(secret, codeAt(step + 1), 0, now), step + 1);
  });

  test('rejects codes two steps away', () => {
    assert.equal(verifyTotp(secret, codeAt(step - 2), 0, now), null);
    assert.equal(verifyTotp(secret, codeAt(step + 2), 0, now), null);
  });

  test('rejects input that is not exactly six digits', () => {
    for (const bad of ['12345', '1234567', 'abcdef', '050 47', '', '05047a']) {
      assert.equal(verifyTotp(secret, bad, 0, now), null, `accepted "${bad}"`);
    }
  });

  test('refuses a step at or before afterStep (replay)', () => {
    assert.equal(verifyTotp(secret, codeAt(step), step, now), null);
    assert.equal(verifyTotp(secret, codeAt(step - 1), step, now), null);
    assert.equal(verifyTotp(secret, codeAt(step + 1), step, now), step + 1);
  });
});

describe('encryptSecret / decryptSecret', () => {
  const plain = 'JBSWY3DPEHPK3PXPJBSWY3DPEHPK3PXP';

  test('ciphertext does not contain the plaintext', () => {
    assert.ok(!encryptSecret(plain).includes(plain));
  });

  test('two encryptions of the same secret differ (random IV)', () => {
    assert.notEqual(encryptSecret(plain), encryptSecret(plain));
  });

  test('round-trips', () => {
    assert.equal(decryptSecret(encryptSecret(plain)), plain);
  });

  test('a tampered ciphertext throws', () => {
    const [version, iv, tag, data] = encryptSecret(plain).split('.');
    const flipped = (data[0] === 'A' ? 'B' : 'A') + data.slice(1);
    assert.throws(() => decryptSecret([version, iv, tag, flipped].join('.')));
  });
});

describe('backup codes', () => {
  test('ten unique codes in XXXXX-XXXXX form with matching hashes', () => {
    const { codes, hashes } = generateBackupCodes();
    assert.equal(codes.length, 10);
    assert.equal(new Set(codes).size, 10);
    for (const code of codes) assert.match(code, /^[A-Z2-9]{5}-[A-Z2-9]{5}$/);
    assert.equal(hashes.length, 10);
    for (const hash of hashes) {
      assert.match(hash, /^[0-9a-f]{64}$/);
      assert.ok(!codes.includes(hash));
    }
  });

  test('hashing ignores case, spaces and dashes', () => {
    const reference = hashBackupCode('ABCDE-FGHJK');
    assert.equal(hashBackupCode('abcde-fghjk'), reference);
    assert.equal(hashBackupCode('ABCDEFGHJK'), reference);
    assert.equal(hashBackupCode(' abcde fghjk '), reference);
    assert.notEqual(hashBackupCode('ABCDE-FGHJM'), reference);
  });
});
