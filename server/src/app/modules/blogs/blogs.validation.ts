import { z } from 'zod';

const createBlogValidationSchema = z.object({
  body: z.object({
    name: z.string({
      error: 'Qualification name is required!',
    }),
    banner: z.string({
      error: 'Qualification designation is required!',
    }),
    description: z.string({
      error: 'Qualification description is required!',
    }),
    images: z
      .string({
        error: 'Qualification duration is required!',
      })
      .optional(),
    tags: z.string({
      error: 'Qualification description is required!',
    }),
    author: z.string({
      error: 'Qualification description is required!',
    }),
  }),
});

const updateBlogValidationSchema = z.object({
  body: z.object({
    name: z
      .string({
        error: 'Qualification name is required!',
      })
      .optional(),
    banner: z
      .string({
        error: 'Qualification designation is required!',
      })
      .optional(),
    description: z
      .string({
        error: 'Qualification description is required!',
      })
      .optional(),
    images: z
      .string({
        error: 'Qualification duration is required!',
      })
      .optional(),
    tags: z
      .string({
        error: 'Qualification description is required!',
      })
      .optional(),
  }),
});

export const BlogValidations = {
  createBlogValidationSchema,
  updateBlogValidationSchema,
};
