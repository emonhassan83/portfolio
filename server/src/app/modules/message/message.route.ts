import express from 'express';
import auth from '../../middleware/auth';
import validateRequest from '../../middleware/validateRequest';
import { contactLimiter, writeLimiter } from '../../middleware/security';
import { USER_ROLE } from '../user/user.constant';
import { MessageControllers } from './message.controller';
import { MessageValidation } from './message.validation';

const router = express.Router();
const admin = auth(USER_ROLE.admin);

// Public: the home page contact form
router.post(
  '/',
  contactLimiter,
  validateRequest(MessageValidation.createMessage, { strip: true }),
  MessageControllers.createMessage,
);

// Admin: inbox
router.get('/', admin, validateRequest(MessageValidation.listMessages), MessageControllers.listMessages);
router.patch(
  '/:id',
  admin,
  writeLimiter,
  validateRequest(MessageValidation.updateMessage, { strip: true }),
  MessageControllers.updateMessage,
);
router.delete(
  '/:id',
  admin,
  writeLimiter,
  validateRequest(MessageValidation.messageById),
  MessageControllers.deleteMessage,
);

export const MessageRoutes = router;
