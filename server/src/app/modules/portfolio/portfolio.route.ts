import express from 'express';
import auth from '../../middleware/auth';
import validateRequest from '../../middleware/validateRequest';
import catchAsync from '../../utils/catchAsync';
import { writeLimiter } from '../../middleware/security';
import { USER_ROLE } from '../user/user.constant';
import { PortfolioControllers } from './portfolio.controller';
import { PortfolioValidation, resourceSchemas } from './portfolio.validation';
import { TPortfolioResource } from './portfolio.interface';

const router = express.Router();
const admin = auth(USER_ROLE.admin);

/** Validates and strips the body with the schema of the resource named in the URL. */
const validateResourceBody = catchAsync(async (req, _res, next) => {
  const schema = resourceSchemas[req.params.resource as TPortfolioResource];
  req.body = await schema.parseAsync(req.body);
  next();
});

// Public: what the home page renders
router.get('/', PortfolioControllers.getPublicPortfolio);

// Admin: profile singleton
router.get('/profile', admin, PortfolioControllers.getProfile);
router.put(
  '/profile',
  admin,
  writeLimiter,
  validateRequest(PortfolioValidation.updateProfile, { strip: true }),
  PortfolioControllers.updateProfile,
);

// Admin: one-time import of the default content
router.post(
  '/import',
  admin,
  writeLimiter,
  validateRequest(PortfolioValidation.importAll, { strip: true }),
  PortfolioControllers.importAll,
);

// Admin: collections
router.get(
  '/:resource',
  admin,
  validateRequest(PortfolioValidation.listResource),
  PortfolioControllers.listResource,
);
router.post(
  '/:resource',
  admin,
  writeLimiter,
  validateRequest(PortfolioValidation.createResource),
  validateResourceBody,
  PortfolioControllers.createResource,
);
router.patch(
  '/:resource/reorder',
  admin,
  writeLimiter,
  validateRequest(PortfolioValidation.reorderResource, { strip: true }),
  PortfolioControllers.reorderResource,
);
router.put(
  '/:resource/:id',
  admin,
  writeLimiter,
  validateRequest(PortfolioValidation.resourceById),
  validateResourceBody,
  PortfolioControllers.updateResource,
);
router.delete(
  '/:resource/:id',
  admin,
  writeLimiter,
  validateRequest(PortfolioValidation.resourceById),
  PortfolioControllers.deleteResource,
);

export const PortfolioRoutes = router;
