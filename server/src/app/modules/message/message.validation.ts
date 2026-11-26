import { z } from 'zod';
import { MESSAGE_STATUS } from './message.constant';

const objectId = z.string().regex(/^[a-f\d]{24}$/i, 'Invalid id');

const createMessage = z.object({
  body: z.strictObject({
    name: z.string({ error: 'Name is required' }).trim().min(1, 'Name is required').max(100),
    email: z.string({ error: 'Email is required' }).trim().email('Invalid email').max(254),
    message: z
      .string({ error: 'Message is required' })
      .trim()
      .min(5, 'Message is too short')
      .max(5000, 'Message cannot be more than 5000 characters'),
    website: z.string().max(200).optional(),
  }),
});

const listMessages = z.object({
  query: z.strictObject({
    status: z.enum(MESSAGE_STATUS).optional(),
    searchTerm: z.string().trim().max(100).optional(),
    page: z.string().regex(/^\d{1,4}$/).optional(),
    limit: z.string().regex(/^\d{1,3}$/).optional(),
  }),
});

const updateMessage = z.object({
  params: z.object({ id: objectId }),
  body: z
    .strictObject({
      status: z.enum(MESSAGE_STATUS).optional(),
      note: z.string().max(2000).optional(),
    })
    .refine((b) => b.status !== undefined || b.note !== undefined, 'Nothing to update'),
});

const messageById = z.object({ params: z.object({ id: objectId }) });

export const MessageValidation = { createMessage, listMessages, updateMessage, messageById };
