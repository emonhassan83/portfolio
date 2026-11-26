import { AddressInfo } from 'net';
import { Server } from 'http';

// Set before the app (and its dotenv config) loads: dotenv never overrides existing
// variables, so tests cannot reach the real database, mailbox or secrets.
process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = '';
process.env.EMAIL = '';
process.env.APP_PASS = '';
process.env.BCRYPT_SALT_ROUNDS = '4';
process.env.JWT_ACCESS_SECRET = 'test-access-secret';
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret';
process.env.JWT_CHALLENGE_SECRET = 'test-challenge-secret';
process.env.TOTP_ENCRYPTION_KEY = 'test-totp-encryption-key';

import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../src/app';
import { User } from '../src/app/modules/user/user.model';
import { totpCode, totpStep } from '../src/app/modules/Auth/auth.totp';

let mongo: MongoMemoryServer;
let server: Server;
let baseUrl = '';
let ipCounter = 0;

export const startTestServer = async () => {
  mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri());
  server = app.listen(0);
  baseUrl = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
};

export const stopTestServer = async () => {
  await new Promise((resolve) => server.close(resolve));
  await mongoose.disconnect();
  await mongo.stop();
};

export const resetDb = () => User.deleteMany({});

export const PASSWORD = 'correct-horse-battery';

export const createUser = (overrides: Record<string, unknown> = {}) =>
  User.create({
    name: 'Admin',
    email: `admin${Date.now()}${Math.floor(Math.random() * 1e6)}@example.com`,
    password: PASSWORD,
    contactNumber: '000',
    address: 'nowhere',
    role: 'admin',
    ...overrides,
  });

/** Raw document including every secret field, for assertions about what is stored. */
export const rawUser = (id: unknown) =>
  User.findById(id).select('+password +securityAnswer +totpSecret +totpPendingSecret +totpLastStep +backupCodes').lean();

/** Valid authenticator code for a base32 secret; `offset` shifts the 30 s time step. */
export const codeFor = (secret: string, offset = 0) => totpCode(secret, totpStep() + offset);

export type TResult = { status: number; body: any; headers: Headers };

/**
 * A browser-like client: keeps cookies between calls, sends the CSRF header and
 * uses its own IP (via X-Forwarded-For), so per-IP rate limits do not leak between tests.
 */
export const createClient = (options: { csrf?: boolean } = {}) => {
  const cookies = new Map<string, string>();
  const ip = `10.${Math.floor(ipCounter / 250) % 250}.${ipCounter++ % 250}.7`;

  const request = async (method: string, path: string, body?: unknown, headers: Record<string, string> = {}): Promise<TResult> => {
    const res = await fetch(`${baseUrl}/api${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'X-Forwarded-For': ip,
        ...(options.csrf === false ? {} : { 'X-Requested-With': 'portfolio-dashboard' }),
        ...(cookies.size ? { Cookie: [...cookies].map(([k, v]) => `${k}=${v}`).join('; ') } : {}),
        ...headers,
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    for (const line of res.headers.getSetCookie()) {
      const [pair] = line.split(';');
      const index = pair.indexOf('=');
      const name = pair.slice(0, index);
      const value = pair.slice(index + 1);
      if (value) cookies.set(name, value);
      else cookies.delete(name);
    }
    const text = await res.text();
    let parsed: unknown = text;
    try {
      parsed = JSON.parse(text);
    } catch {
      // non-JSON response
    }
    return { status: res.status, body: parsed, headers: res.headers };
  };

  return {
    cookies,
    get: (path: string) => request('GET', path),
    post: (path: string, body?: unknown, headers?: Record<string, string>) => request('POST', path, body ?? {}, headers),
    put: (path: string, body?: unknown) => request('PUT', path, body ?? {}),
    del: (path: string, body?: unknown) => request('DELETE', path, body ?? {}),
    /** Raw Set-Cookie lines of the last response are not kept; use `request` for header checks. */
    request,
  };
};

export type TClient = ReturnType<typeof createClient>;

/**
 * Signs in with the password, enrols an authenticator and returns the base32
 * secret plus the ten backup codes. The client stays signed in.
 */
export const enrolTwoFactor = async (client: TClient, email: string) => {
  await client.post('/auth/login', { email, password: PASSWORD });
  const setup = await client.post('/auth/2fa/setup', { currentPassword: PASSWORD });
  const secret: string = setup.body.data.secret;
  // The previous step: enrolment burns it, leaving the current step free for a login.
  const enabled = await client.post('/auth/2fa/enable', { code: codeFor(secret, -1) });
  return { secret, backupCodes: enabled.body.data.backupCodes as string[] };
};
