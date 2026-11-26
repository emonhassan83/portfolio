import { z } from 'zod';

const createReviewValidationSchema = z.object({
  body: z.object({
    user: z.string({
      error: 'Review name is required!',
    }),
    rating: z.number({
      error: 'Review rating is required!',
    }),
    content: z.string({
      error: 'Review content is required!',
    }),
  }),
});

const updateReviewValidationSchema = z.object({
  body: z.object({
    rating: z
      .number({
        error: 'Review rating is required!',
      })
      .optional(),
    content: z
      .string({
        error: 'Review content is required!',
      })
      .optional(),
  }),
});

export const ReviewValidations = {
  createReviewValidationSchema,
  updateReviewValidationSchema,
};
