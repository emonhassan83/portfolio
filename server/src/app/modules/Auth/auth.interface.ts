export interface TLoginUser {
  email: string;
  password: string;
}

export interface TVerifyChallenge {
  challengeToken: string;
  answer: string;
}

export interface TVerifyTwoFactor {
  challengeToken: string;
  /** 6-digit authenticator code or a backup code. */
  code: string;
}

export interface TPasswordAndCode {
  currentPassword: string;
  /** Required while two-factor is on. */
  code?: string;
}

export interface TSecurityQuestion extends TPasswordAndCode {
  question: string;
  answer: string;
}
