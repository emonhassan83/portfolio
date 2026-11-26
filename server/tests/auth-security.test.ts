import './helpers';
import assert from 'node:assert/strict';
import { after, before, describe, test } from 'node:test';
import jwt from 'jsonwebtoken';
import {
  codeFor,
  createClient,
  createUser,
  enrolTwoFactor,
  PASSWORD,
  rawUser,
  startTestServer,
  stopTestServer,
  TClient,
} from './helpers';

before(startTestServer);
after(stopTestServer);

const QUESTION = 'What was your first pet?';
const ANSWER = 'Rex';

/** A six-digit code that is not valid in the current acceptance window. */
const wrongCode = (secret: string) => {
  const valid = new Set([-1, 0, 1].map((offset) => codeFor(secret, offset)));
  return ['000000', '111111', '222222', '333333'].find((code) => !valid.has(code)) as string;
};

const WRONG_PASSWORD = 'wrong-password-1';

const passwordLogin = (email: string, client: TClient = createClient(), password = PASSWORD) =>
  client.post('/auth/login', { email, password });

/** Password step, then the authenticator code, from a brand-new client. */
const signInWithTotp = async (email: string, secret: string, offset = 0) => {
  const client = createClient();
  const step1 = await passwordLogin(email, client);
  const res = await client.post('/auth/login/2fa', {
    challengeToken: step1.body.data.challengeToken,
    code: codeFor(secret, offset),
  });
  return { client, res };
};

const setQuestion = (client: TClient, password = PASSWORD, code?: string) =>
  client.put('/auth/security-question', {
    currentPassword: password,
    question: QUESTION,
    answer: ANSWER,
    ...(code ? { code } : {}),
  });

describe('login without two-factor', () => {
  test('password login completes and sets session cookies', async () => {
    const user = await createUser();
    const client = createClient();
    const res = await passwordLogin(user.email, client);
    assert.equal(res.status, 200);
    assert.equal(res.body.data.step, 'done');
    assert.ok(client.cookies.has('access_token'));
    assert.ok(client.cookies.has('refresh_token'));
    assert.equal((await client.get('/auth/me')).status, 200);
  });

  test('legacy security question challenge completes with the answer', async () => {
    const user = await createUser();
    const client = createClient();
    await passwordLogin(user.email, client);
    assert.equal((await setQuestion(client)).status, 200);

    const fresh = createClient();
    const step1 = await passwordLogin(user.email, fresh);
    assert.equal(step1.body.data.step, 'challenge');
    assert.equal(step1.body.data.question, QUESTION);
    assert.ok(!fresh.cookies.has('access_token'));

    const step2 = await fresh.post('/auth/login/verify', {
      challengeToken: step1.body.data.challengeToken,
      answer: ANSWER,
    });
    assert.equal(step2.status, 200, JSON.stringify(step2.body));
    assert.equal(step2.body.data.step, 'done');
    assert.equal((await fresh.get('/auth/me')).status, 200);
  });
});

describe('login with two-factor', () => {
  test('password step returns totp and sets no session cookies', async () => {
    const user = await createUser();
    await enrolTwoFactor(createClient(), user.email);

    const client = createClient();
    const res = await passwordLogin(user.email, client);
    assert.equal(res.body.data.step, 'totp');
    assert.equal(client.cookies.size, 0);
    assert.equal(res.headers.getSetCookie().length, 0);
    assert.equal((await client.get('/auth/me')).status, 401);
  });

  test('a valid code signs in with HttpOnly, SameSite=Strict cookies', async () => {
    const user = await createUser();
    const { secret } = await enrolTwoFactor(createClient(), user.email);
    const { res, client } = await signInWithTotp(user.email, secret);
    assert.equal(res.status, 200, JSON.stringify(res.body));
    assert.equal(res.body.data.step, 'done');

    const lines = res.headers.getSetCookie();
    const access = lines.find((line) => line.startsWith('access_token='));
    const refresh = lines.find((line) => line.startsWith('refresh_token='));
    assert.ok(access, 'access cookie missing');
    assert.ok(refresh, 'refresh cookie missing');
    for (const line of [access, refresh]) {
      assert.match(line, /;\s*HttpOnly/i);
      assert.match(line, /;\s*SameSite=Strict/i);
    }
    assert.equal((await client.get('/auth/me')).status, 200);
  });

  test('the same TOTP code cannot be used twice', async () => {
    const user = await createUser();
    const { secret } = await enrolTwoFactor(createClient(), user.email);
    const first = await signInWithTotp(user.email, secret);
    assert.equal(first.res.status, 200);

    const replay = await signInWithTotp(user.email, secret);
    assert.equal(replay.res.status, 401);
    assert.equal(replay.client.cookies.size, 0);
  });

  test('a wrong TOTP code is rejected', async () => {
    const user = await createUser();
    const { secret } = await enrolTwoFactor(createClient(), user.email);
    const client = createClient();
    const step1 = await passwordLogin(user.email, client);
    const res = await client.post('/auth/login/2fa', {
      challengeToken: step1.body.data.challengeToken,
      code: wrongCode(secret),
    });
    assert.equal(res.status, 401);
    assert.equal(client.cookies.size, 0);
  });

  test('a backup code signs in once; lower case without the dash also works', async () => {
    const user = await createUser();
    const { backupCodes } = await enrolTwoFactor(createClient(), user.email);

    const client = createClient();
    const step1 = await passwordLogin(user.email, client);
    const first = await client.post('/auth/login/2fa', {
      challengeToken: step1.body.data.challengeToken,
      code: backupCodes[0],
    });
    assert.equal(first.status, 200, JSON.stringify(first.body));
    assert.equal(first.body.data.usedBackupCode, true);
    assert.equal(first.body.data.backupCodesRemaining, 9);

    const again = createClient();
    const step2 = await passwordLogin(user.email, again);
    const reused = await again.post('/auth/login/2fa', {
      challengeToken: step2.body.data.challengeToken,
      code: backupCodes[0],
    });
    assert.equal(reused.status, 401);

    const third = createClient();
    const step3 = await passwordLogin(user.email, third);
    const variant = await third.post('/auth/login/2fa', {
      challengeToken: step3.body.data.challengeToken,
      code: backupCodes[1].toLowerCase().replace('-', ''),
    });
    assert.equal(variant.status, 200, JSON.stringify(variant.body));
    assert.equal(variant.body.data.backupCodesRemaining, 8);
  });

  test('five wrong codes lock the account; a correct code is refused afterwards', async () => {
    const user = await createUser();
    const { secret } = await enrolTwoFactor(createClient(), user.email);
    const client = createClient();
    const step1 = await passwordLogin(user.email, client);
    const challengeToken = step1.body.data.challengeToken;

    for (let i = 0; i < 5; i++) {
      const res = await client.post('/auth/login/2fa', { challengeToken, code: wrongCode(secret) });
      assert.equal(res.status, 401);
    }
    const locked = await client.post('/auth/login/2fa', { challengeToken, code: codeFor(secret) });
    assert.equal(locked.status, 429, JSON.stringify(locked.body));
  });

  test('five wrong passwords lock the account, even with the right password', async () => {
    const user = await createUser();
    const client = createClient();
    for (let i = 0; i < 5; i++) {
      const res = await passwordLogin(user.email, client, WRONG_PASSWORD);
      assert.equal(res.status, 401);
    }
    const locked = await passwordLogin(user.email, client);
    assert.equal(locked.status, 429, JSON.stringify(locked.body));
  });

  test('the legacy verify endpoint cannot bypass two-factor', async () => {
    const user = await createUser();
    const admin = createClient();
    const { secret } = await enrolTwoFactor(admin, user.email);
    assert.equal((await setQuestion(admin, PASSWORD, codeFor(secret))).status, 200);

    const client = createClient();
    const step1 = await passwordLogin(user.email, client);
    assert.equal(step1.body.data.step, 'totp');
    const res = await client.post('/auth/login/verify', {
      challengeToken: step1.body.data.challengeToken,
      answer: ANSWER,
    });
    assert.equal(res.status, 401);
    assert.equal(client.cookies.size, 0);
  });

  test('an access token cannot stand in for a challenge token', async () => {
    const user = await createUser();
    const admin = createClient();
    const { secret } = await enrolTwoFactor(admin, user.email);
    const accessToken = admin.cookies.get('access_token') as string;

    const client = createClient();
    await passwordLogin(user.email, client);
    const res = await client.post('/auth/login/2fa', { challengeToken: accessToken, code: codeFor(secret) });
    assert.equal(res.status, 401);
  });

  test('a challenge token placed in the access cookie does not authenticate', async () => {
    const user = await createUser();
    await enrolTwoFactor(createClient(), user.email);
    const step1 = await passwordLogin(user.email, createClient());
    const challengeToken = step1.body.data.challengeToken as string;

    const attacker = createClient();
    attacker.cookies.set('access_token', challengeToken);
    assert.equal((await attacker.get('/auth/me')).status, 401);
  });

  test('garbage and forged challenge tokens are rejected', async () => {
    const user = await createUser();
    const client = createClient();
    const forged = jwt.sign(
      { _id: String(user._id), email: user.email, role: 'admin', tv: 0, typ: 'challenge' },
      'attacker-secret',
      { expiresIn: '5m' },
    );
    for (const token of ['not-a-token', 'a.b.c', forged]) {
      const res = await client.post('/auth/login/2fa', { challengeToken: token, code: '123456' });
      assert.equal(res.status, 401, `accepted ${token.slice(0, 12)}`);
    }
  });

  test('unknown email and wrong password look identical', async () => {
    const user = await createUser();
    const client = createClient();
    const unknown = await passwordLogin(`nobody${Date.now()}@example.com`, client);
    const wrong = await passwordLogin(user.email, client, WRONG_PASSWORD);
    assert.equal(unknown.status, wrong.status);
    assert.equal(unknown.body.message, wrong.body.message);
  });
});

describe('two-factor enrolment and management', () => {
  test('setup needs a session and the current password', async () => {
    const user = await createUser();
    const anonymous = createClient();
    assert.equal((await anonymous.post('/auth/2fa/setup', { currentPassword: PASSWORD })).status, 401);

    const client = createClient();
    await passwordLogin(user.email, client);
    assert.equal((await client.post('/auth/2fa/setup', { currentPassword: 'wrong-password-1' })).status, 403);

    const ok = await client.post('/auth/2fa/setup', { currentPassword: PASSWORD });
    assert.equal(ok.status, 200);
    assert.match(ok.body.data.secret, /^[A-Z2-7]+$/);
    assert.ok(ok.body.data.otpauthUrl.startsWith('otpauth://totp/'));
  });

  test('two-factor is not active until the setup is confirmed', async () => {
    const user = await createUser();
    const client = createClient();
    await passwordLogin(user.email, client);
    await client.post('/auth/2fa/setup', { currentPassword: PASSWORD });

    const res = await passwordLogin(user.email, createClient());
    assert.equal(res.body.data.step, 'done');
  });

  test('a wrong code leaves two-factor off; a right code enables it and returns ten backup codes', async () => {
    const user = await createUser();
    const client = createClient();
    await passwordLogin(user.email, client);
    const setup = await client.post('/auth/2fa/setup', { currentPassword: PASSWORD });
    const secret: string = setup.body.data.secret;

    const bad = await client.post('/auth/2fa/enable', { code: wrongCode(secret) });
    assert.equal(bad.status, 400);
    assert.equal((await client.get('/auth/me')).body.data.twoFactorEnabled, false);

    const good = await client.post('/auth/2fa/enable', { code: codeFor(secret) });
    assert.equal(good.status, 200, JSON.stringify(good.body));
    assert.equal(good.body.data.backupCodes.length, 10);
    assert.equal((await client.get('/auth/me')).body.data.twoFactorEnabled, true);
  });

  test('secrets, backup codes and passwords are stored encrypted or hashed', async () => {
    const user = await createUser();
    const { secret, backupCodes } = await enrolTwoFactor(createClient(), user.email);
    const stored = (await rawUser(user._id)) as any;

    assert.ok(stored.totpSecret);
    assert.ok(!stored.totpSecret.includes(secret));
    assert.equal(stored.backupCodes.length, 10);
    for (const hash of stored.backupCodes) {
      assert.match(hash, /^[0-9a-f]{64}$/);
      assert.ok(!backupCodes.includes(hash));
    }
    assert.notEqual(stored.password, PASSWORD);
    assert.ok(stored.password.startsWith('$2'));
  });

  test('profile responses never leak secrets or credential fields', async () => {
    const user = await createUser();
    const client = createClient();
    const { secret, backupCodes } = await enrolTwoFactor(client, user.email);
    assert.equal((await setQuestion(client, PASSWORD, codeFor(secret))).status, 200);

    const stored = (await rawUser(user._id)) as any;
    const me = await client.get('/auth/me');
    const profile = await client.get('/user/my-profile');
    assert.equal(me.status, 200);
    assert.equal(profile.status, 200);

    for (const res of [me, profile]) {
      const text = JSON.stringify(res.body);
      assert.ok(!text.includes(secret), 'TOTP secret leaked');
      for (const key of ['totpSecret', 'totpPendingSecret', 'backupCodes', 'password', 'securityAnswer']) {
        assert.ok(!text.includes(`"${key}"`), `${key} leaked`);
      }
      assert.ok(!text.includes(stored.securityAnswer), 'security answer hash leaked');
      for (const hash of stored.backupCodes) assert.ok(!text.includes(hash), 'backup hash leaked');
      for (const code of backupCodes) assert.ok(!text.includes(code), 'backup code leaked');
    }
    assert.equal(typeof me.body.data.backupCodesRemaining, 'number');
  });

  test('enabling two-factor revokes other sessions', async () => {
    const user = await createUser();
    const other = createClient();
    await passwordLogin(user.email, other);
    assert.equal((await other.get('/auth/me')).status, 200);

    const enrolling = createClient();
    await enrolTwoFactor(enrolling, user.email);

    assert.equal((await other.get('/auth/me')).status, 401);
    assert.equal((await other.post('/auth/refresh-token')).status, 401);
    assert.equal((await enrolling.get('/auth/me')).status, 200);
  });

  test('disabling needs the password and a valid code', async () => {
    const user = await createUser();
    const client = createClient();
    const { secret } = await enrolTwoFactor(client, user.email);

    const wrongCodeRes = await client.post('/auth/2fa/disable', { currentPassword: PASSWORD, code: wrongCode(secret) });
    assert.equal(wrongCodeRes.status, 403);
    const wrongPassRes = await client.post('/auth/2fa/disable', { currentPassword: 'wrong-password-1', code: codeFor(secret) });
    assert.equal(wrongPassRes.status, 403);

    const ok = await client.post('/auth/2fa/disable', { currentPassword: PASSWORD, code: codeFor(secret) });
    assert.equal(ok.status, 200, JSON.stringify(ok.body));
    const login = await passwordLogin(user.email, createClient());
    assert.equal(login.body.data.step, 'done');
  });

  test('regenerating backup codes invalidates the old ones', async () => {
    const user = await createUser();
    const client = createClient();
    const { secret, backupCodes } = await enrolTwoFactor(client, user.email);

    const regen = await client.post('/auth/2fa/backup-codes', { currentPassword: PASSWORD, code: codeFor(secret) });
    assert.equal(regen.status, 200, JSON.stringify(regen.body));
    const fresh: string[] = regen.body.data.backupCodes;
    assert.equal(fresh.length, 10);

    const oldAttempt = createClient();
    const step1 = await passwordLogin(user.email, oldAttempt);
    const old = await oldAttempt.post('/auth/login/2fa', { challengeToken: step1.body.data.challengeToken, code: backupCodes[0] });
    assert.equal(old.status, 401);

    const newAttempt = createClient();
    const step2 = await passwordLogin(user.email, newAttempt);
    const ok = await newAttempt.post('/auth/login/2fa', { challengeToken: step2.body.data.challengeToken, code: fresh[0] });
    assert.equal(ok.status, 200, JSON.stringify(ok.body));
    assert.equal(ok.body.data.usedBackupCode, true);
  });

  test('changing the security question needs a code while two-factor is on', async () => {
    const user = await createUser();
    const client = createClient();
    const { secret } = await enrolTwoFactor(client, user.email);

    assert.equal((await setQuestion(client)).status, 403);
    assert.equal((await setQuestion(client, PASSWORD, codeFor(secret))).status, 200);
  });
});

describe('account recovery', () => {
  test('the security answer recovers the account and switches two-factor off', async () => {
    const user = await createUser();
    const client = createClient();
    const { secret } = await enrolTwoFactor(client, user.email);
    assert.equal((await setQuestion(client, PASSWORD, codeFor(secret))).status, 200);

    const attempt = createClient();
    const step1 = await passwordLogin(user.email, attempt);
    assert.equal(step1.body.data.step, 'totp');
    assert.equal(step1.body.data.recoveryQuestion, QUESTION);

    const res = await attempt.post('/auth/login/recover', {
      challengeToken: step1.body.data.challengeToken,
      answer: ANSWER,
    });
    assert.equal(res.status, 200, JSON.stringify(res.body));
    assert.equal(res.body.data.twoFactorDisabled, true);
    assert.ok(attempt.cookies.has('access_token'));

    const stored = (await rawUser(user._id)) as any;
    assert.equal(stored.totpEnabled, false);
    assert.ok(!stored.totpSecret);
    assert.equal(stored.backupCodes.length, 0);
  });

  test('a wrong recovery answer is rejected', async () => {
    const user = await createUser();
    const client = createClient();
    const { secret } = await enrolTwoFactor(client, user.email);
    assert.equal((await setQuestion(client, PASSWORD, codeFor(secret))).status, 200);

    const attempt = createClient();
    const step1 = await passwordLogin(user.email, attempt);
    const res = await attempt.post('/auth/login/recover', {
      challengeToken: step1.body.data.challengeToken,
      answer: 'Fido',
    });
    assert.equal(res.status, 401);
    assert.equal(attempt.cookies.size, 0);
  });

  test('without a security question recovery is unavailable', async () => {
    const user = await createUser();
    await enrolTwoFactor(createClient(), user.email);

    const attempt = createClient();
    const step1 = await passwordLogin(user.email, attempt);
    assert.equal(step1.body.data.step, 'totp');
    assert.equal(step1.body.data.recoveryQuestion, null);
    const res = await attempt.post('/auth/login/recover', {
      challengeToken: step1.body.data.challengeToken,
      answer: ANSWER,
    });
    assert.equal(res.status, 401);
  });

  test('recovery revokes sessions that existed before it', async () => {
    const user = await createUser();
    const owner = createClient();
    const { secret } = await enrolTwoFactor(owner, user.email);
    assert.equal((await setQuestion(owner, PASSWORD, codeFor(secret))).status, 200);

    const signedIn = await signInWithTotp(user.email, secret, 1);
    assert.equal(signedIn.res.status, 200, JSON.stringify(signedIn.res.body));
    const attackerClient = signedIn.client;
    assert.equal((await attackerClient.get('/auth/me')).status, 200);

    const recovery = createClient();
    const step1 = await passwordLogin(user.email, recovery);
    const res = await recovery.post('/auth/login/recover', {
      challengeToken: step1.body.data.challengeToken,
      answer: ANSWER,
    });
    assert.equal(res.status, 200);

    assert.equal((await owner.get('/auth/me')).status, 401);
    assert.equal((await attackerClient.get('/auth/me')).status, 401);
    assert.equal((await recovery.get('/auth/me')).status, 200);
  });
});

describe('request hardening', () => {
  test('a state-changing request without the CSRF header is refused', async () => {
    const user = await createUser();
    const client = createClient({ csrf: false });
    const res = await client.post('/auth/login', { email: user.email, password: PASSWORD });
    assert.equal(res.status, 403);
    assert.equal(client.cookies.size, 0);
  });

  test('the 21st credential request from one client is rate limited', async () => {
    const client = createClient();
    const statuses: number[] = [];
    for (let i = 0; i < 21; i++) {
      const res = await passwordLogin(`ghost${i}@example.com`, client);
      statuses.push(res.status);
    }
    assert.ok(statuses.slice(0, 20).every((status) => status === 401), JSON.stringify(statuses));
    assert.equal(statuses[20], 429);
  });

  test('admin routes reject anonymous and non-admin users', async () => {
    const anonymous = createClient();
    assert.equal((await anonymous.get('/user/users')).status, 401);

    const member = await createUser({ role: 'user' });
    const memberClient = createClient();
    await passwordLogin(member.email, memberClient);
    assert.equal((await memberClient.get('/user/users')).status, 403);

    const admin = await createUser({ role: 'admin' });
    const adminClient = createClient();
    await passwordLogin(admin.email, adminClient);
    assert.equal((await adminClient.get('/user/users')).status, 200);
  });

  test('extra fields and operator objects cannot be used to log in', async () => {
    const user = await createUser();
    const client = createClient();
    const extra = await client.post('/auth/login', { email: user.email, password: PASSWORD, role: 'admin' });
    assert.ok(extra.status === 400 || extra.status === 401, `extra field gave ${extra.status}`);

    const operator = await client.post('/auth/login', { email: { $gt: '' }, password: 'x' });
    assert.ok(operator.status === 400 || operator.status === 401, `operator gave ${operator.status}`);
    assert.equal(client.cookies.size, 0);
  });

  test('logout revokes the session', async () => {
    const user = await createUser();
    const client = createClient();
    await passwordLogin(user.email, client);
    const saved = client.cookies.get('access_token') as string;

    assert.equal((await client.post('/auth/logout')).status, 200);
    client.cookies.set('access_token', saved);
    assert.equal((await client.get('/auth/me')).status, 401);
  });
});
