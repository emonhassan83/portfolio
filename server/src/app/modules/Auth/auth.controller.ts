import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AuthServices } from './auth.service';
import {
  clearSessionCookies,
  REFRESH_COOKIE,
  setSessionCookies,
} from './auth.utils';

const loginUser = catchAsync(async (req, res) => {
  const result = await AuthServices.loginUser(req.body);

  if (result.step === 'totp') {
    return sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Enter the code from your authenticator app to continue',
      data: {
        step: result.step,
        challengeToken: result.challengeToken,
        recoveryQuestion: result.recoveryQuestion,
      },
    });
  }

  if (result.step === 'challenge') {
    return sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Answer your security question to continue',
      data: {
        step: result.step,
        question: result.question,
        challengeToken: result.challengeToken,
      },
    });
  }

  setSessionCookies(res, result);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Logged in successfully!',
    data: { step: result.step, user: result.user },
  });
});

const verifyChallenge = catchAsync(async (req, res) => {
  const result = await AuthServices.verifyChallenge(req.body);
  setSessionCookies(res, result);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Logged in successfully!',
    data: { step: 'done', user: result.user },
  });
});

const verifyTwoFactor = catchAsync(async (req, res) => {
  const result = await AuthServices.verifyTwoFactor(req.body);
  setSessionCookies(res, result);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Logged in successfully!',
    data: {
      step: 'done',
      user: result.user,
      usedBackupCode: result.usedBackupCode,
      backupCodesRemaining: result.backupCodesRemaining,
    },
  });
});

const recoverWithSecurityAnswer = catchAsync(async (req, res) => {
  const result = await AuthServices.recoverWithSecurityAnswer(req.body);
  setSessionCookies(res, result);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Account recovered. Two-factor authentication is now off; set it up again.',
    data: { step: 'done', user: result.user, twoFactorDisabled: true },
  });
});

const beginTwoFactorSetup = catchAsync(async (req, res) => {
  const result = await AuthServices.beginTwoFactorSetup(req.user._id, req.body);
  res.set('Cache-Control', 'no-store');

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Scan the QR code, then confirm with a code from the app',
    data: result,
  });
});

const enableTwoFactor = catchAsync(async (req, res) => {
  const result = await AuthServices.enableTwoFactor(req.user._id, req.body);
  // Other sessions were revoked; this one continues on fresh cookies.
  setSessionCookies(res, result);
  res.set('Cache-Control', 'no-store');

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Two-factor authentication is on',
    data: { user: result.user, backupCodes: result.backupCodes },
  });
});

const disableTwoFactor = catchAsync(async (req, res) => {
  const result = await AuthServices.disableTwoFactor(req.user._id, req.body);
  setSessionCookies(res, result);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Two-factor authentication is off',
    data: { user: result.user },
  });
});

const regenerateBackupCodes = catchAsync(async (req, res) => {
  const result = await AuthServices.regenerateBackupCodes(req.user._id, req.body);
  res.set('Cache-Control', 'no-store');

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'New backup codes generated. The old ones no longer work.',
    data: result,
  });
});

const removeSecurityQuestion = catchAsync(async (req, res) => {
  const result = await AuthServices.removeSecurityQuestion(req.user._id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Security question removed',
    data: result,
  });
});

const getMe = catchAsync(async (req, res) => {
  const result = await AuthServices.getMe(req.user._id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Session is valid',
    data: result,
  });
});

const setSecurityQuestion = catchAsync(async (req, res) => {
  const result = await AuthServices.setSecurityQuestion(req.user._id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Security question saved',
    data: result,
  });
});

const changePassword = catchAsync(async (req, res) => {
  await AuthServices.changePassword(req.user._id, req.body);
  clearSessionCookies(res);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Password updated. Sign in again with the new password.',
    data: null,
  });
});

const refreshToken = catchAsync(async (req, res) => {
  try {
    const result = await AuthServices.refreshToken(req.cookies?.[REFRESH_COOKIE]);
    setSessionCookies(res, result);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Session refreshed',
      data: { user: result.user },
    });
  } catch (error) {
    clearSessionCookies(res);
    throw error;
  }
});

const logout = catchAsync(async (req, res) => {
  await AuthServices.logout(req.cookies?.[REFRESH_COOKIE]);
  clearSessionCookies(res);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Logged out',
    data: null,
  });
});

const forgetPassword = catchAsync(async (req, res) => {
  await AuthServices.forgetPassword(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'If that account exists, a reset link has been sent to its email.',
    data: null,
  });
});

const resetPassword = catchAsync(async (req, res) => {
  await AuthServices.resetPassword(req.body, req.headers.authorization);
  clearSessionCookies(res);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Password reset successful!',
    data: null,
  });
});

export const AuthControllers = {
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
