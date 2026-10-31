import { z } from 'zod';

const createQualificationValidationSchema = z.object({
  body: z.object({
    name: z
      .string({
        required_error: 'Qualification name is required!',
      }),
    designation: z.string({
      required_error: 'Qualification designation is required!',
    }),
    description: z.string({
      required_error: 'Qualification description is required!',
    }),
    duration: z.string({
      required_error: 'Qualification duration is required!',
    }),
  }),
});

const updateQualificationValidationSchema = z.object({
  body: z.object({
    name: z
      .string({
        required_error: 'Qualification name is required!',
      })
      .optional(),
    designation: z
      .string({
        required_error: 'Qualification designation is required!',
      })
      .optional(),
    description: z
      .string({
        required_error: 'Qualification description is required!',
      })
      .optional(),
    duration: z
      .string({
        required_error: 'Qualification duration is required!',
      })
      .optional(),
  }),
});

export const QualificationValidations = {
  createQualificationValidationSchema,
  updateQualificationValidationSchema,
};
