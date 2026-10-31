import express from 'express';
import zodValidationRequest from '../../middleware/validateRequest';
import { USER_ROLE } from '../user/user.constant';
import auth from '../../middleware/auth';
import { skillValidations } from './skills.validation';
import { skillControllers } from './skills.controller';

const router = express.Router();

router.post(
  '/add-skill',
  auth(USER_ROLE.admin),
  zodValidationRequest(skillValidations.createSkillValidationSchema),
  skillControllers.addSkill,
);

router.put(
  '/update-skill/:id',
  auth(USER_ROLE.admin),
  zodValidationRequest(skillValidations.updateSkillValidationSchema),
  skillControllers.updateASkill,
);

router.get('/all-skills', skillControllers.getAllSkills);

router.get('/:id', skillControllers.getASkill);

router.delete(
  '/delete-skill/:id',
  auth(USER_ROLE.admin),
  skillControllers.deleteASkill,
);

export const SkillRoutes = router;
