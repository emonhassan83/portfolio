import { z } from 'zod';

const createReviewValidationSchema = z.object({
  body: z.object({
    user: z.string({
      required_error: 'Review name is required!',
    }),
    rating: z.number({
      required_error: 'Review rating is required!',
    }),
    content: z.string({
      required_error: 'Review content is required!',
    }),
  }),
});

const updateReviewValidationSchema = z.object({
  body: z.object({
    rating: z
      .number({
        required_error: 'Review rating is required!',
      })
      .optional(),
    content: z
      .string({
        required_error: 'Review content is required!',
      })
      .optional(),
  }),
});

export const ReviewValidations = {
  createReviewValidationSchema,
  updateReviewValidationSchema,
};
