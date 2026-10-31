import { z } from 'zod';

const createBlogValidationSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: 'Qualification name is required!',
    }),
    banner: z.string({
      required_error: 'Qualification designation is required!',
    }),
    description: z.string({
      required_error: 'Qualification description is required!',
    }),
    images: z
      .string({
        required_error: 'Qualification duration is required!',
      })
      .optional(),
    tags: z.string({
      required_error: 'Qualification description is required!',
    }),
    author: z.string({
      required_error: 'Qualification description is required!',
    }),
  }),
});

const updateBlogValidationSchema = z.object({
  body: z.object({
    name: z
      .string({
        required_error: 'Qualification name is required!',
      })
      .optional(),
    banner: z
      .string({
        required_error: 'Qualification designation is required!',
      })
      .optional(),
    description: z
      .string({
        required_error: 'Qualification description is required!',
      })
      .optional(),
    images: z
      .string({
        required_error: 'Qualification duration is required!',
      })
      .optional(),
    tags: z
      .string({
        required_error: 'Qualification description is required!',
      })
      .optional(),
  }),
});

export const BlogValidations = {
  createBlogValidationSchema,
  updateBlogValidationSchema,
};
