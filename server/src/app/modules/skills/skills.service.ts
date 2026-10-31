import { JwtPayload } from 'jsonwebtoken';
import { User } from '../user/user.model';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { TSkill } from './skills.interface';
import { Skill } from './skills.model';
import QueryBuilder from '../../builder/QueryBuilder';
import { SkillsSearchableFields } from './skills.constant';

const createIntoDB = async (
  skill: TSkill,
  userData: JwtPayload,
) => {
  //* checking if the user is exist
  const user = await User.isUserExistsByUserEmail(userData?.email);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
  }

  //* checking if the user is already deleted
  const isDeleted = user?.isDeleted;
  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted !');
  }

  //* checking if the user is blocked
  const userStatus = user?.status;
  if (userStatus === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked ! !');
  }

  const result = await Skill.create(skill);
  return result;
};

const getAllIntoDB = async (query: Record<string, unknown>) => {
  const skillQuery = new QueryBuilder(Skill.find(), query)
    .search(SkillsSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await skillQuery.modelQuery;
  const meta = await skillQuery.countTotal();
  return {
    meta,
    result,
  };
};

const getAIntoDB = async (id: string, userData: JwtPayload) => {
  const user = await User.isUserExistsByUserEmail(userData.email);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
  }

  const result = await Skill.findById(id);
  return result;
};

const updateIntoDB = async (
  id: string,
  payload: Partial<TSkill>,
  userData: JwtPayload,
) => {
  const user = await User.isUserExistsByUserEmail(userData.email);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
  }

  //* checking if the user is already deleted
  const isDeleted = user?.isDeleted;
  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted !');
  }

  //* checking if the user is blocked
  const userStatus = user?.status;
  if (userStatus === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked ! !');
  }

  const skill = await Skill.findById(id);
  if (!skill) {
    throw new AppError(httpStatus.NOT_FOUND, 'Skill is not found!');
  }

  const result = await Skill.findByIdAndUpdate(id, payload, {
    new: true,
  });
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Skill is not updated!');
  }
  return result;
};

const deleteAIntoDB = async (id: string, userData: JwtPayload) => {
  const user = await User.isUserExistsByUserEmail(userData.email);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
  }
  
  //* checking if the user is already deleted
  const isDeleted = user?.isDeleted;
  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted !');
  }

  //* checking if the user is blocked
  const userStatus = user?.status;
  if (userStatus === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked ! !');
  }

  const skill = await Skill.findById(id);
  if (!skill) {
    throw new AppError(httpStatus.NOT_FOUND, 'Skill is not found!');
  }

  const result = await Skill.findByIdAndDelete(id);
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Skill is not deleted!');
  }
  return result;
};

export const SkillServices = {
  createIntoDB,
  getAllIntoDB,
  getAIntoDB,
  updateIntoDB,
  deleteAIntoDB,
};
