import bcrypt from 'bcrypt';
import config from '../../config';
import { GenderOptions, UserRoleStatus, UserStatus } from './user.constant';
import { TUser, UserModel } from './user.interface';
import { Schema, model } from 'mongoose';

const userSchema = new Schema<TUser, UserModel>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    contactNumber: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    photoUrl: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      enum: UserRoleStatus,
      default: 'user',
    },
    status: {
      type: String,
      enum: UserStatus,
      default: 'active',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    gender: {
      type: String,
      enum: GenderOptions,
      default: 'unknown',
    },
    securityQuestion: {
      type: String,
      default: null,
    },
    securityAnswer: {
      type: String,
      default: null,
      select: false,
    },
    totpEnabled: {
      type: Boolean,
      default: false,
    },
    totpSecret: {
      type: String,
      default: null,
      select: false,
    },
    totpPendingSecret: {
      type: String,
      default: null,
      select: false,
    },
    totpLastStep: {
      type: Number,
      default: 0,
      select: false,
    },
    backupCodes: {
      type: [String],
      default: [],
      select: false,
    },
    tokenVersion: {
      type: Number,
      default: 0,
    },
    failedAttempts: {
      type: Number,
      default: 0,
    },
    lockUntil: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: {
      // Never serialise credential material, even if it was selected explicitly.
      transform: (_doc, ret: Record<string, unknown>) => {
        delete ret.password;
        delete ret.securityAnswer;
        delete ret.totpSecret;
        delete ret.totpPendingSecret;
        delete ret.totpLastStep;
        delete ret.backupCodes;
        delete ret.tokenVersion;
        delete ret.failedAttempts;
        delete ret.lockUntil;
        return ret;
      },
    },
  },
);

// * hash the password only when it is new or changed (not on every save)
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(
    this.password,
    Number(config.bcrypt_salt_rounds),
  );
});

userSchema.pre('save', async function () {
  if (!this.isNew) return;
  const isUserExist = await User.findOne({ email: this.email });
  if (isUserExist) {
    throw new Error(
      'This user is already exist, changes email if you create new user',
    );
  }
});

userSchema.statics.isUserExistsByUserEmail = async function (email: string) {
  return await this.findOne({ email });
};

userSchema.statics.isUserExistsByEmail = async function (email: string) {
  return await this.findOne({ email });
};

userSchema.statics.isUserExistsByUserId = async function (id: string) {
  return await this.findOne({ _id: id });
};

userSchema.statics.findWithSecrets = async function (
  filter: Record<string, unknown>,
) {
  return await this.findOne(filter).select(
    '+password +securityAnswer +totpSecret +totpPendingSecret +totpLastStep +backupCodes',
  );
};

userSchema.statics.isPasswordMatched = async function (
  plainTextPassword: string,
  hashedPassword: string,
) {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
};

export const User = model<TUser, UserModel>('User', userSchema);
