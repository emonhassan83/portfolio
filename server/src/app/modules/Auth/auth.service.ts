import bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import config from '../../config';
import AppError from '../../errors/AppError';
import { User } from '../user/user.model';
import { TUser } from '../user/user.interface';
import {
  TLoginUser,
  TPasswordAndCode,
  TSecurityQuestion,
  TVerifyChallenge,
  TVerifyTwoFactor,
} from './auth.interface';
import {
  decryptSecret,
  encryptSecret,
  generateBackupCodes,
  generateTotpSecret,
  hashBackupCode,
  otpauthUrl,
  verifyTotp,
} from './auth.totp';
import {
  createToken,
  normalizeAnswer,
  TTokenType,
  verifyToken,
} from './auth.utils';
import emailSender from '../../utils/emailSender';

const MAX_FAILED_ATTEMPTS = 5;
const LOCK_MINUTES = 15;
const CHALLENGE_EXPIRES_IN = '5m';
const RESET_EXPIRES_IN = '10m';
const INVALID_CREDENTIALS = 'Invalid email or password';
const CHALLENGE_EXPIRED = 'Login session expired. Sign in again.';
const INVALID_CODE = 'Invalid authentication code';
// Compared against when the user does not exist, so response time does not reveal valid emails.
let dummyHash: Promise<string> | null = null;

const saltRounds = () => Number(config.bcrypt_salt_rounds) || 12;
const getDummyHash = () => (dummyHash ??= bcrypt.hash('not-a-real-password', saltRounds()));

const tokenPayload = (user: TUser, typ: TTokenType) => ({
  _id: String(user._id),
  email: user.email,
  role: user.role,
  tv: user.tokenVersion ?? 0,
  typ,
});

const publicUser = (user: TUser) => ({
  _id: String(user._id),
  name: user.name,
  email: user.email,
  role: user.role,
  photoUrl: user.photoUrl ?? null,
  hasSecurityQuestion: !!user.securityQuestion,
  twoFactorEnabled: !!user.totpEnabled,
});

const issueSession = (user: TUser) => ({
  accessToken: createToken(
    tokenPayload(user, 'access'),
    config.jwt_access_secret as string,
    config.jwt_access_expires_in,
  ),
  refreshToken: createToken(
    tokenPayload(user, 'refresh'),
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in,
  ),
  user: publicUser(user),
});

const assertNotLocked = (user: TUser) => {
  if (user.lockUntil && user.lockUntil.getTime() > Date.now()) {
    throw new AppError(
      httpStatus.TOO_MANY_REQUESTS,
      `Too many failed attempts. Try again in ${LOCK_MINUTES} minutes.`,
    );
  }
};

const assertUsable = (user: TUser | null): TUser => {
  if (!user || user.isDeleted || user.status === 'blocked') {
    throw new AppError(httpStatus.UNAUTHORIZED, INVALID_CREDENTIALS);
  }
  assertNotLocked(user);
  return user;
};

/** Counted with an atomic increment, so parallel guesses cannot slip past the limit. */
const registerFailure = async (user: TUser) => {
  const updated = await User.findOneAndUpdate(
    { _id: user._id },
    { $inc: { failedAttempts: 1 } },
    { returnDocument: 'after' },
  );
  if ((updated?.failedAttempts ?? 0) >= MAX_FAILED_ATTEMPTS) {
    await User.updateOne(
      { _id: user._id },
      { failedAttempts: 0, lockUntil: new Date(Date.now() + LOCK_MINUTES * 60_000) },
    );
  }
};

const clearFailures = async (user: TUser) => {
  if (user.failedAttempts || user.lockUntil) {
    await User.updateOne({ _id: user._id }, { failedAttempts: 0, lockUntil: null });
  }
};

const challengeTokenFor = (user: TUser) =>
  createToken(tokenPayload(user, 'challenge'), config.jwt_challenge_secret as string, CHALLENGE_EXPIRES_IN);

/** The user behind a valid, unexpired challenge token (issued after a correct password). */
const readChallenge = async (challengeToken: string) => {
  let decoded;
  try {
    decoded = verifyToken(challengeToken, config.jwt_challenge_secret as string);
  } catch {
    throw new AppError(httpStatus.UNAUTHORIZED, CHALLENGE_EXPIRED);
  }
  if (decoded.typ !== 'challenge') {
    throw new AppError(httpStatus.UNAUTHORIZED, CHALLENGE_EXPIRED);
  }
  const user = assertUsable(await User.findWithSecrets({ _id: decoded._id }));
  if ((user.tokenVersion ?? 0) !== decoded.tv) {
    throw new AppError(httpStatus.UNAUTHORIZED, CHALLENGE_EXPIRED);
  }
  return user;
};

/**
 * Accepts a 6-digit authenticator code or a backup code. Either is consumed
 * atomically: a time step or backup code can only ever succeed once.
 */
const consumeSecondFactor = async (user: TUser, rawCode: string) => {
  if (!user.totpEnabled || !user.totpSecret) return null;
  const code = rawCode.replace(/\s/g, '');

  if (/^\d{6}$/.test(code)) {
    const step = verifyTotp(decryptSecret(user.totpSecret), code, user.totpLastStep ?? 0);
    if (step === null) return null;
    const used = await User.updateOne(
      { _id: user._id, totpLastStep: { $lt: step } },
      { totpLastStep: step },
    );
    return used.modifiedCount === 1 ? ('totp' as const) : null;
  }

  const hash = hashBackupCode(code);
  const used = await User.updateOne(
    { _id: user._id, backupCodes: hash },
    { $pull: { backupCodes: hash } },
  );
  return used.modifiedCount === 1 ? ('backup' as const) : null;
};

/** For signed-in changes to security settings. Wrong codes count towards the lockout. */
const requireSecondFactor = async (user: TUser, code: string | undefined) => {
  if (!user.totpEnabled) return;
  assertNotLocked(user);
  if (!code || !(await consumeSecondFactor(user, code))) {
    await registerFailure(user);
    throw new AppError(httpStatus.FORBIDDEN, INVALID_CODE);
  }
  await clearFailures(user);
};

const requirePassword = async (userId: string, password: string) => {
  const user = await User.findWithSecrets({ _id: userId });
  if (!user) throw new AppError(httpStatus.UNAUTHORIZED, 'Unauthorized Access');
  if (!(await User.isPasswordMatched(password, user.password))) {
    throw new AppError(httpStatus.FORBIDDEN, 'Current password is incorrect');
  }
  return user;
};

const TWO_FACTOR_OFF = {
  totpEnabled: false,
  totpSecret: null,
  totpPendingSecret: null,
  totpLastStep: 0,
  backupCodes: [],
};

/**
 * Step 1: password. With an authenticator enrolled this returns a short-lived
 * challenge for the code step; without one, the legacy security-question step
 * still applies if a question is set.
 */
const loginUser = async (payload: TLoginUser) => {
  const found = await User.findWithSecrets({ email: payload.email });
  if (!found) {
    await bcrypt.compare(payload.password, await getDummyHash());
    throw new AppError(httpStatus.UNAUTHORIZED, INVALID_CREDENTIALS);
  }
  const user = assertUsable(found);

  if (!(await User.isPasswordMatched(payload.password, user.password))) {
    await registerFailure(user);
    throw new AppError(httpStatus.UNAUTHORIZED, INVALID_CREDENTIALS);
  }
  await clearFailures(user);

  const hasQuestion = !!(user.securityQuestion && user.securityAnswer);

  if (user.totpEnabled && user.totpSecret) {
    return {
      step: 'totp' as const,
      challengeToken: challengeTokenFor(user),
      // Shown only as a recovery option, and only after the correct password.
      recoveryQuestion: hasQuestion ? (user.securityQuestion as string) : null,
    };
  }

  if (hasQuestion) {
    return {
      step: 'challenge' as const,
      question: user.securityQuestion as string,
      challengeToken: challengeTokenFor(user),
    };
  }

  return { step: 'done' as const, ...issueSession(user) };
};

/** Step 2 with an authenticator: a 6-digit code or a one-time backup code. */
const verifyTwoFactor = async (payload: TVerifyTwoFactor) => {
  const user = await readChallenge(payload.challengeToken);
  if (!user.totpEnabled) throw new AppError(httpStatus.UNAUTHORIZED, CHALLENGE_EXPIRED);

  const method = await consumeSecondFactor(user, payload.code);
  if (!method) {
    await registerFailure(user);
    throw new AppError(httpStatus.UNAUTHORIZED, INVALID_CODE);
  }
  await clearFailures(user);

  const backupCodesRemaining = (user.backupCodes?.length ?? 0) - (method === 'backup' ? 1 : 0);
  return { ...issueSession(user), usedBackupCode: method === 'backup', backupCodesRemaining };
};

/**
 * Account recovery when the authenticator and backup codes are lost: after the
 * password, the security answer signs in and switches two-factor off so it can
 * be enrolled again. Every other session is revoked and the owner is emailed.
 */
const recoverWithSecurityAnswer = async (payload: TVerifyChallenge) => {
  const user = await readChallenge(payload.challengeToken);
  if (!user.totpEnabled || !user.securityAnswer) {
    throw new AppError(httpStatus.UNAUTHORIZED, CHALLENGE_EXPIRED);
  }

  if (!(await bcrypt.compare(normalizeAnswer(payload.answer), user.securityAnswer))) {
    await registerFailure(user);
    throw new AppError(httpStatus.UNAUTHORIZED, 'Incorrect answer');
  }

  const updated = await User.findOneAndUpdate(
    { _id: user._id },
    { ...TWO_FACTOR_OFF, failedAttempts: 0, lockUntil: null, $inc: { tokenVersion: 1 } },
    { returnDocument: 'after' },
  );
  if (!updated) throw new AppError(httpStatus.UNAUTHORIZED, CHALLENGE_EXPIRED);

  if (config.emailSender.email) {
    emailSender(
      updated.email,
      `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px;">
        <h2>Two-factor authentication was switched off</h2>
        <p>Your portfolio dashboard account was recovered with its security question, which turned two-factor authentication off and signed out every other session.</p>
        <p>If this was not you, change your password immediately and set up two-factor authentication again.</p>
      </div>`,
      'Security alert: two-factor authentication disabled',
    ).catch(() => undefined);
  }

  return issueSession(updated);
};

/** Step 2 without an authenticator (legacy): the security question answer. */
const verifyChallenge = async (payload: TVerifyChallenge) => {
  const user = await readChallenge(payload.challengeToken);
  // With an authenticator enrolled the question is a recovery path, never a login factor.
  if (user.totpEnabled || !user.securityAnswer) {
    throw new AppError(httpStatus.UNAUTHORIZED, CHALLENGE_EXPIRED);
  }

  const ok = await bcrypt.compare(normalizeAnswer(payload.answer), user.securityAnswer);
  if (!ok) {
    await registerFailure(user);
    throw new AppError(httpStatus.UNAUTHORIZED, 'Incorrect answer');
  }
  await clearFailures(user);

  return issueSession(user);
};

const getMe = async (userId: string) => {
  const user = await User.findById(userId).select('+backupCodes');
  if (!user) throw new AppError(httpStatus.UNAUTHORIZED, 'Unauthorized Access');
  return { ...publicUser(user), backupCodesRemaining: user.backupCodes?.length ?? 0 };
};

/** Starts enrolment: the secret stays pending until a code from the app confirms it. */
const beginTwoFactorSetup = async (userId: string, payload: { currentPassword: string }) => {
  const user = await requirePassword(userId, payload.currentPassword);
  if (user.totpEnabled) {
    throw new AppError(
      httpStatus.CONFLICT,
      'Two-factor authentication is already on. Turn it off first to re-enrol.',
    );
  }

  const secret = generateTotpSecret();
  await User.updateOne({ _id: user._id }, { totpPendingSecret: encryptSecret(secret) });
  return { secret, otpauthUrl: otpauthUrl(secret, user.email) };
};

/** Confirms enrolment, returns the backup codes (shown once) and revokes other sessions. */
const enableTwoFactor = async (userId: string, payload: { code: string }) => {
  const user = await User.findWithSecrets({ _id: userId });
  if (!user) throw new AppError(httpStatus.UNAUTHORIZED, 'Unauthorized Access');
  if (user.totpEnabled || !user.totpPendingSecret) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Start two-factor setup first');
  }
  assertNotLocked(user);

  const step = verifyTotp(decryptSecret(user.totpPendingSecret), payload.code.replace(/\s/g, ''));
  if (step === null) {
    await registerFailure(user);
    throw new AppError(httpStatus.BAD_REQUEST, INVALID_CODE);
  }

  const { codes, hashes } = generateBackupCodes();
  const updated = await User.findOneAndUpdate(
    { _id: user._id, totpEnabled: { $ne: true } },
    {
      totpEnabled: true,
      totpSecret: user.totpPendingSecret,
      totpPendingSecret: null,
      totpLastStep: step,
      backupCodes: hashes,
      failedAttempts: 0,
      $inc: { tokenVersion: 1 },
    },
    { returnDocument: 'after' },
  );
  if (!updated) throw new AppError(httpStatus.BAD_REQUEST, 'Start two-factor setup first');

  return { ...issueSession(updated), backupCodes: codes };
};

const disableTwoFactor = async (userId: string, payload: TPasswordAndCode) => {
  const user = await requirePassword(userId, payload.currentPassword);
  if (!user.totpEnabled) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Two-factor authentication is not on');
  }
  await requireSecondFactor(user, payload.code);

  const updated = await User.findOneAndUpdate(
    { _id: user._id },
    { ...TWO_FACTOR_OFF, $inc: { tokenVersion: 1 } },
    { returnDocument: 'after' },
  );
  if (!updated) throw new AppError(httpStatus.UNAUTHORIZED, 'Unauthorized Access');
  return issueSession(updated);
};

/** Replaces every backup code; the old ones stop working. */
const regenerateBackupCodes = async (userId: string, payload: TPasswordAndCode) => {
  const user = await requirePassword(userId, payload.currentPassword);
  if (!user.totpEnabled) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Two-factor authentication is not on');
  }
  await requireSecondFactor(user, payload.code);

  const { codes, hashes } = generateBackupCodes();
  await User.updateOne({ _id: user._id }, { backupCodes: hashes });
  return { backupCodes: codes };
};

const setSecurityQuestion = async (userId: string, payload: TSecurityQuestion) => {
  const user = await requirePassword(userId, payload.currentPassword);
  // The question can switch two-factor off during recovery, so changing it needs a code too.
  await requireSecondFactor(user, payload.code);

  await User.updateOne(
    { _id: user._id },
    {
      securityQuestion: payload.question,
      securityAnswer: await bcrypt.hash(normalizeAnswer(payload.answer), saltRounds()),
    },
  );
  return { hasSecurityQuestion: true, question: payload.question };
};

const removeSecurityQuestion = async (userId: string, payload: TPasswordAndCode) => {
  const user = await requirePassword(userId, payload.currentPassword);
  await requireSecondFactor(user, payload.code);
  await User.updateOne({ _id: user._id }, { securityQuestion: null, securityAnswer: null });
  return { hasSecurityQuestion: false };
};

const changePassword = async (
  userId: string,
  payload: { oldPassword: string; newPassword: string },
) => {
  const user = await User.findWithSecrets({ _id: userId });
  if (!user) throw new AppError(httpStatus.UNAUTHORIZED, 'Unauthorized Access');

  if (!(await User.isPasswordMatched(payload.oldPassword, user.password))) {
    throw new AppError(httpStatus.FORBIDDEN, 'Current password is incorrect');
  }

  // Bumping tokenVersion signs out every existing session.
  await User.updateOne(
    { _id: user._id },
    {
      password: await bcrypt.hash(payload.newPassword, saltRounds()),
      $inc: { tokenVersion: 1 },
    },
  );
};

const refreshToken = async (token: string | undefined) => {
  if (!token) throw new AppError(httpStatus.UNAUTHORIZED, 'Unauthorized Access');

  let decoded;
  try {
    decoded = verifyToken(token, config.jwt_refresh_secret as string);
  } catch {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Unauthorized Access');
  }
  if (decoded.typ !== 'refresh') {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Unauthorized Access');
  }

  const user = await User.findById(decoded._id);
  if (
    !user ||
    user.isDeleted ||
    user.status === 'blocked' ||
    (user.tokenVersion ?? 0) !== decoded.tv
  ) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Unauthorized Access');
  }

  // Rotate both tokens.
  return issueSession(user);
};

/** Revokes every session of the user that owns the refresh token, if it is valid. */
const logout = async (token: string | undefined) => {
  if (!token) return;
  try {
    const decoded = verifyToken(token, config.jwt_refresh_secret as string);
    if (decoded.typ === 'refresh' && decoded._id) {
      await User.updateOne({ _id: decoded._id }, { $inc: { tokenVersion: 1 } });
    }
  } catch {
    // Expired or invalid token: nothing to revoke, cookies are cleared anyway.
  }
};

/** Always resolves, so the response does not reveal whether the email exists. */
const forgetPassword = async (payload: { email: string }) => {
  const user = await User.findOne({ email: payload.email });
  if (!user || user.isDeleted || user.status === 'blocked' || !config.reset_pass_link) return;

  const resetToken = createToken(
    tokenPayload(user, 'reset'),
    config.jwt_access_secret as string,
    RESET_EXPIRES_IN,
  );
  const resetUILink = `${config.reset_pass_link}?id=${user._id}&token=${resetToken}`;

  await emailSender(
    user.email,
    `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
      <h2 style="color: #333;">Password reset request</h2>
      <p style="color: #555;">You requested a password reset for your portfolio dashboard account. The link expires in 10 minutes.</p>
      <p style="text-align: center; margin: 24px 0;">
        <a href="${resetUILink}" style="background-color: #111; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset password</a>
      </p>
      <p style="color: #555;">If you did not request this, ignore this email. Your password will not change.</p>
    </div>
    `,
  );
};

const resetPassword = async (
  payload: { email: string; newPassword: string },
  token: string | undefined,
) => {
  let decoded;
  try {
    decoded = verifyToken(token || '', config.jwt_access_secret as string);
  } catch {
    throw new AppError(httpStatus.FORBIDDEN, 'Reset link is invalid or expired');
  }
  if (decoded.typ !== 'reset' || decoded.email !== payload.email) {
    throw new AppError(httpStatus.FORBIDDEN, 'Reset link is invalid or expired');
  }

  const user = await User.findById(decoded._id);
  if (
    !user ||
    user.isDeleted ||
    user.status === 'blocked' ||
    (user.tokenVersion ?? 0) !== decoded.tv
  ) {
    throw new AppError(httpStatus.FORBIDDEN, 'Reset link is invalid or expired');
  }

  // tokenVersion bump makes the reset link single-use and signs out other sessions.
  await User.updateOne(
    { _id: user._id },
    {
      password: await bcrypt.hash(payload.newPassword, saltRounds()),
      failedAttempts: 0,
      lockUntil: null,
      $inc: { tokenVersion: 1 },
    },
  );
};

export const AuthServices = {
  loginUser,
  verifyChallenge,
  verifyTwoFactor,
  recoverWithSecurityAnswer,
  getMe,
  beginTwoFactorSetup,
  enableTwoFactor,
  disableTwoFactor,
  regenerateBackupCodes,
  setSecurityQuestion,
  removeSecurityQuestion,
  changePassword,
  refreshToken,
  logout,
  forgetPassword,
  resetPassword,
};
