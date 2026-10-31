import { Router } from 'express';
import { UserRoutes } from '../modules/user/user.route';
import { AuthRoutes } from '../modules/Auth/auth.route';
import { ProjectRoutes } from '../modules/project/project.routes';
import { SkillRoutes } from '../modules/skills/skills.route';
import { BlogRoutes } from '../modules/blogs/blogs.route';
import { ReviewRoutes } from '../modules/review/review.route';
import { QualificationRoutes } from '../modules/qualification/qualification.route';

const router = Router();

const moduleRoutes = [
  {
    path: '/user',
    route: UserRoutes,
  },
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/project',
    route: ProjectRoutes,
  },
  {
    path: '/skills',
    route: SkillRoutes,
  },
  {
    path: '/qualifications',
    route: QualificationRoutes,
  },
  {
    path: '/blogs',
    route: BlogRoutes,
  },
  {
    path: '/reviews',
    route: ReviewRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
