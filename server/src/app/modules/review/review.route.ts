import express from 'express';
import zodValidationRequest from '../../middleware/validateRequest';
import { USER_ROLE } from '../user/user.constant';
import auth from '../../middleware/auth';
import { reviewControllers } from './review.controller';
import { ReviewValidations } from './review.validation';

const router = express.Router();

router.post(
  '/add-review',
  auth(USER_ROLE.user),
  zodValidationRequest(ReviewValidations.createReviewValidationSchema),
  reviewControllers.addReview,
);

router.put(
  '/update-review/:id',
  auth(USER_ROLE.admin, USER_ROLE.user),
  zodValidationRequest(ReviewValidations.updateReviewValidationSchema),
  reviewControllers.updateAReview,
);

router.get('/all-reviews', reviewControllers.getAllReviews);

router.get(
  '/my-reviews',
  auth(USER_ROLE.user),
  reviewControllers.getAllMyReviews,
);

router.get('/:id', reviewControllers.getAReview);

router.delete(
  '/delete-review/:id',
  auth(USER_ROLE.admin, USER_ROLE.user),
  reviewControllers.deleteAReview,
);

export const ReviewRoutes = router;
