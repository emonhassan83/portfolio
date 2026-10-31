import { z } from 'zod';

const createProjectValidationSchema = z.object({
  body: z.object({
    name: z
      .string({
        required_error: 'Project name is required!',
      })
      .optional(),
    image: z
      .string({
        required_error: 'Project image is required!',
      })
      .optional(),
    description: z
      .string({
        required_error: 'Project description is required!',
      })
      .optional(),
    features: z
      .string({
        required_error: 'Project features is required!',
      })
      .optional(),
    technologies: z
      .string({
        required_error: 'Project technologies is required!',
      })
      .optional(),
    duration: z
      .string({
        required_error: 'Project duration is required!',
      })
      .optional(),
    live_site_url: z
      .string({
        required_error: 'Project live_site_url is required!',
      })
      .optional(),
    client_site_url: z
      .string({
        required_error: 'Project client_site_url is required!',
      })
      .optional(),
    server_site_url: z
      .string({
        required_error: 'Project server_site_url is required!',
      })
      .optional(),
  }),
});

const updateProjectValidationSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: 'Project name is required!',
    }),
    image: z.string({
      required_error: 'Project image is required!',
    }),
    description: z.string({
      required_error: 'Project description is required!',
    }),
    features: z.string({
      required_error: 'Project features is required!',
    }),
    technologies: z.string({
      required_error: 'Project technologies is required!',
    }),
    duration: z.string({
      required_error: 'Project duration is required!',
    }),
    live_site_url: z.string({
      required_error: 'Project live_site_url is required!',
    }),
    client_site_url: z.string({
      required_error: 'Project client_site_url is required!',
    }),
    server_site_url: z.string({
      required_error: 'Project server_site_url is required!',
    }),
  }),
});

export const projectValidations = {
  createProjectValidationSchema,
  updateProjectValidationSchema,
};
