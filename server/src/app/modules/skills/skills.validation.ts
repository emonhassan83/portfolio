import { z } from 'zod';

const createSkillValidationSchema = z.object({
  body: z.object({
    name: z
      .string({
        error: 'Skill name is required!',
      }),
    image: z
      .string({
        error: 'Skill image is required!',
      }),
  }),
});

const updateSkillValidationSchema = z.object({
  body: z.object({
    name: z.string({
      error: 'Skill name is required!',
    }).optional(),
    image: z.string({
      error: 'Skill image is required!',
    }).optional(),
  }),
});

export const skillValidations = {
  createSkillValidationSchema,
  updateSkillValidationSchema,
};
