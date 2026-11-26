import { z } from 'zod';

const createQualificationValidationSchema = z.object({
  body: z.object({
    name: z
      .string({
        error: 'Qualification name is required!',
      }),
    designation: z.string({
      error: 'Qualification designation is required!',
    }),
    description: z.string({
      error: 'Qualification description is required!',
    }),
    duration: z.string({
      error: 'Qualification duration is required!',
    }),
  }),
});

const updateQualificationValidationSchema = z.object({
  body: z.object({
    name: z
      .string({
        error: 'Qualification name is required!',
      })
      .optional(),
    designation: z
      .string({
        error: 'Qualification designation is required!',
      })
      .optional(),
    description: z
      .string({
        error: 'Qualification description is required!',
      })
      .optional(),
    duration: z
      .string({
        error: 'Qualification duration is required!',
      })
      .optional(),
  }),
});

export const QualificationValidations = {
  createQualificationValidationSchema,
  updateQualificationValidationSchema,
};
