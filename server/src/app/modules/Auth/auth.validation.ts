import { z } from 'zod';

const email = z.string({ error: 'Email is required' }).trim().email('Invalid email').max(254);
const password = z.string({ error: 'Password is required' }).min(1).max(128);
const newPassword = z
  .string({ error: 'New password is required' })
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password cannot be more than 128 characters');

const challengeToken = z.string({ error: 'Challenge token is required' }).min(1).max(2048);
// 6-digit authenticator code, or a backup code such as ABCDE-FGHJK.
const code = z.string({ error: 'Authentication code is required' }).trim().min(6).max(32);

const loginValidationSchema = z.object({
  body: z.strictObject({ email, password }),
});

const verifyChallengeValidationSchema = z.object({
  body: z.strictObject({
    challengeToken,
    answer: z.string({ error: 'Answer is required' }).trim().min(1).max(200),
  }),
});

const verifyTwoFactorValidationSchema = z.object({
  body: z.strictObject({ challengeToken, code }),
});

const twoFactorSetupValidationSchema = z.object({
  body: z.strictObject({ currentPassword: password }),
});

const twoFactorEnableValidationSchema = z.object({
  body: z.strictObject({ code }),
});

const passwordAndCodeValidationSchema = z.object({
  body: z.strictObject({ currentPassword: password, code: code.optional() }),
});

const securityQuestionValidationSchema = z.object({
  body: z.strictObject({
    currentPassword: password,
    code: code.optional(),
    question: z.string({ error: 'Question is required' }).trim().min(8).max(200),
    answer: z
      .string({ error: 'Answer is required' })
      .trim()
      .min(3, 'Answer must be at least 3 characters')
      .max(200),
  }),
});

const changePasswordValidationSchema = z.object({
  body: z.strictObject({
    oldPassword: password,
    newPassword,
  }),
});

const forgetPasswordValidationSchema = z.object({
  body: z.strictObject({ email }),
});

const resetPasswordValidationSchema = z.object({
  body: z.strictObject({ email, newPassword }),
});

export const AuthValidation = {
  loginValidationSchema,
  verifyChallengeValidationSchema,
  verifyTwoFactorValidationSchema,
  twoFactorSetupValidationSchema,
  twoFactorEnableValidationSchema,
  passwordAndCodeValidationSchema,
  securityQuestionValidationSchema,
  changePasswordValidationSchema,
  forgetPasswordValidationSchema,
  resetPasswordValidationSchema,
};
