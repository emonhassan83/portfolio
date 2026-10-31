import express from 'express';
import zodValidationRequest from '../../middleware/validateRequest';
import { USER_ROLE } from '../user/user.constant';
import auth from '../../middleware/auth';
import { projectValidations } from './project.validation';
import { projectControllers } from './project.controller';

const router = express.Router();

router.post(
  '/add-project',
  auth(USER_ROLE.admin),
  zodValidationRequest(
    projectValidations.createProjectValidationSchema,
  ),
  projectControllers.addProject,
);

router.put(
  '/update-project/:id',
  auth(USER_ROLE.admin),
  zodValidationRequest(
    projectValidations.updateProjectValidationSchema,
  ),
  projectControllers.updateAProject,
);

router.get(
  '/all-projects',
  projectControllers.getAllProjects,
);

router.get(
  '/:id',
  projectControllers.getAProject,
);

router.delete(
  '/delete-project/:id',
  auth(USER_ROLE.admin),
  projectControllers.deleteAProject,
);

export const ProjectRoutes = router;
