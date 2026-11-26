import express from 'express';
import validateRequest from '../../middleware/validateRequest';
import { AuthControllers } from './auth.controller';
import { AuthValidation } from './auth.validation';
import { USER_ROLE } from '../user/user.constant';
import auth from '../../middleware/auth';
import { loginLimiter } from '../../middleware/security';

const router = express.Router();

router.post(
  '/login',
  loginLimiter,
  validateRequest(AuthValidation.loginValidationSchema, { strip: true }),
  AuthControllers.loginUser,
);

router.post(
  '/login/verify',
  loginLimiter,
  validateRequest(AuthValidation.verifyChallengeValidationSchema, { strip: true }),
  AuthControllers.verifyChallenge,
);

router.post(
  '/login/2fa',
  loginLimiter,
  validateRequest(AuthValidation.verifyTwoFactorValidationSchema, { strip: true }),
  AuthControllers.verifyTwoFactor,
);

router.post(
  '/login/recover',
  loginLimiter,
  validateRequest(AuthValidation.verifyChallengeValidationSchema, { strip: true }),
  AuthControllers.recoverWithSecurityAnswer,
);

router.post(
  '/2fa/setup',
  auth(USER_ROLE.admin, USER_ROLE.user),
  loginLimiter,
  validateRequest(AuthValidation.twoFactorSetupValidationSchema, { strip: true }),
  AuthControllers.beginTwoFactorSetup,
);

router.post(
  '/2fa/enable',
  auth(USER_ROLE.admin, USER_ROLE.user),
  loginLimiter,
  validateRequest(AuthValidation.twoFactorEnableValidationSchema, { strip: true }),
  AuthControllers.enableTwoFactor,
);

router.post(
  '/2fa/disable',
  auth(USER_ROLE.admin, USER_ROLE.user),
  loginLimiter,
  validateRequest(AuthValidation.passwordAndCodeValidationSchema, { strip: true }),
  AuthControllers.disableTwoFactor,
);

router.post(
  '/2fa/backup-codes',
  auth(USER_ROLE.admin, USER_ROLE.user),
  loginLimiter,
  validateRequest(AuthValidation.passwordAndCodeValidationSchema, { strip: true }),
  AuthControllers.regenerateBackupCodes,
);

router.delete(
  '/security-question',
  auth(USER_ROLE.admin, USER_ROLE.user),
  loginLimiter,
  validateRequest(AuthValidation.passwordAndCodeValidationSchema, { strip: true }),
  AuthControllers.removeSecurityQuestion,
);

router.get('/me', auth(USER_ROLE.admin, USER_ROLE.user), AuthControllers.getMe);

router.put(
  '/security-question',
  auth(USER_ROLE.admin, USER_ROLE.user),
  loginLimiter,
  validateRequest(AuthValidation.securityQuestionValidationSchema, { strip: true }),
  AuthControllers.setSecurityQuestion,
);

router.post(
  '/change-password',
  auth(USER_ROLE.admin, USER_ROLE.user),
  loginLimiter,
  validateRequest(AuthValidation.changePasswordValidationSchema, { strip: true }),
  AuthControllers.changePassword,
);

router.post('/refresh-token', AuthControllers.refreshToken);

router.post('/logout', AuthControllers.logout);

router.post(
  '/forget-password',
  loginLimiter,
  validateRequest(AuthValidation.forgetPasswordValidationSchema, { strip: true }),
  AuthControllers.forgetPassword,
);

router.post(
  '/reset-password',
  loginLimiter,
  validateRequest(AuthValidation.resetPasswordValidationSchema, { strip: true }),
  AuthControllers.resetPassword,
);

export const AuthRoutes = router;
