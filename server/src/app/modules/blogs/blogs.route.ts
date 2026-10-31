import express from 'express';
import zodValidationRequest from '../../middleware/validateRequest';
import { USER_ROLE } from '../user/user.constant';
import auth from '../../middleware/auth';
import { blogControllers } from './blogs.controller';
import { BlogValidations } from './blogs.validation';

const router = express.Router();

router.post(
  '/add-blog',
  auth(USER_ROLE.admin, USER_ROLE.user),
  zodValidationRequest(BlogValidations.createBlogValidationSchema),
  blogControllers.addBlog,
);

router.patch(
  '/published-blog/:id',
  auth(USER_ROLE.admin),
  blogControllers.publishBlog,
);

router.put(
  '/update-blog/:id',
  auth(USER_ROLE.admin, USER_ROLE.user),
  zodValidationRequest(BlogValidations.updateBlogValidationSchema),
  blogControllers.updateABlog,
);

router.get('/all-blogs', blogControllers.getAllBlogs);

router.get(
  '/my-blogs',
  auth(USER_ROLE.admin, USER_ROLE.user),
  blogControllers.getAllMyBlogs,
);

router.get('/:id', blogControllers.getABlog);

router.delete(
  '/delete-blog/:id',
  auth(USER_ROLE.admin, USER_ROLE.user),
  blogControllers.deleteABlog,
);

export const BlogRoutes = router;
