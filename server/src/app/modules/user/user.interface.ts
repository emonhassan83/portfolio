import { Types } from 'mongoose';
import { Model } from 'mongoose';
import { USER_ROLE } from './user.constant';

export interface TUser {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  contactNumber: string;
  address: string;
  photoUrl?: string;
  gender?: string;
  role: 'admin' | 'user';
  status: 'active' | 'blocked';
  isDeleted: boolean;
  /** Second login step. The answer is stored as a bcrypt hash and never selected by default. */
  securityQuestion?: string | null;
  securityAnswer?: string | null;
  /** Authenticator app (TOTP). Secrets are AES-GCM encrypted; backup codes are stored as hashes. */
  totpEnabled?: boolean;
  totpSecret?: string | null;
  totpPendingSecret?: string | null;
  /** Last accepted time step, so a code cannot be replayed. */
  totpLastStep?: number;
  backupCodes?: string[];
  /** Bumped on logout / password change; tokens carrying an older version are rejected. */
  tokenVersion: number;
  failedAttempts: number;
  lockUntil?: Date | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface TReqUser {
  _id: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

export interface UserModel extends Model<TUser> {
  isUserExistsByUserEmail(username: string): Promise<TUser>;
  isUserExistsByEmail(email: string): Promise<TUser>;
  /** Includes the password, security-answer, authenticator secret and backup-code hashes; only for credential checks. */
  findWithSecrets(filter: Record<string, unknown>): Promise<TUser | null>;
  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;
}

export type TUserRole = keyof typeof USER_ROLE;
