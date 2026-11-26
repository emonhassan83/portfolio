import { z } from 'zod';
import { GenderOptions, UserRoleStatus, UserStatus } from './user.constant';

// Define the Zod validation schema
const UserValidationSchema = z.object({
  body: z.object({
    name: z.string({
      error: 'User name is required!',
    }),
    email: z.string({
      error: 'Email is required!',
    }),
    password: z
      .string({
        error: 'Password must be a string',
      })
      .min(8, { message: 'Password must be at least 8 characters' })
      .max(128, { message: 'Password cannot be more than 128 characters' }),
    contactNumber: z.string({
      error: 'Contract number is required!',
    }),
    address: z.string({
      error: 'Address is required!',
    }),
  }),
});

const UserUpdateValidationSchema = z.object({
  body: z.object({
    name: z
      .string({
        error: 'User name is required!',
      })
      .optional(),
    email: z
      .string({
        error: 'Email is required!',
      })
      .optional(),
    contactNumber: z
      .string({
        error: 'Contract number is required!',
      })
      .optional(),
    address: z
      .string({
        error: 'Address is required!',
      })
      .optional(),
    photoUrl: z
      .string({
        error: 'Photo url is required!',
      })
      .optional(),
    gender: z.enum([...(GenderOptions as [string, ...string[]])]).optional(),
  }),
});

const changeUserRoleValidationSchema = z.object({
  body: z.object({
    userId: z.string({
      error: 'User id is required!',
    }),
    role: z.enum([...(UserRoleStatus as [string, ...string[]])], {
      error: 'User role is required!',
    }),
  }),
});

const changeUserStatusValidationSchema = z.object({
  body: z.object({
    userId: z.string({
      error: 'User id is required!',
    }),
    status: z.enum([...(UserStatus as [string, ...string[]])], {
      error: 'User status is required!',
    }),
  }),
});

const UserSoftDeleteValidationSchema = z.object({
  body: z.object({
    userId: z.string({
      error: 'User id is required!',
    }),
    isDeleted: z.boolean({
      error: 'isDeleted field is required!',
    }),
  }),
});

export const UserValidation = {
  UserValidationSchema,
  UserUpdateValidationSchema,
  changeUserRoleValidationSchema,
  changeUserStatusValidationSchema,
  UserSoftDeleteValidationSchema,
};
