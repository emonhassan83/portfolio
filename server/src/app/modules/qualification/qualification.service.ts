import { JwtPayload } from 'jsonwebtoken';
import { User } from '../user/user.model';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import { TQualification } from './qualification.interface';
import { Qualification } from './qualification.model';
import { QualificationSearchableFields } from './qualification.constant';

const createIntoDB = async (
  qualification: TQualification,
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

  const result = await Qualification.create(qualification);
  return result;
};

const getAllIntoDB = async (query: Record<string, unknown>) => {
  const qualificationQuery = new QueryBuilder(Qualification.find(), query)
    .search(QualificationSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await qualificationQuery.modelQuery;
  const meta = await qualificationQuery.countTotal();
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

  const result = await Qualification.findById(id);
  return result;
};

const updateIntoDB = async (
  id: string,
  payload: Partial<TQualification>,
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

  const qualification = await Qualification.findById(id);
  if (!qualification) {
    throw new AppError(httpStatus.NOT_FOUND, 'Qualification is not found!');
  }

  const result = await Qualification.findByIdAndUpdate(id, payload, {
    new: true,
  });
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Qualification is not updated!');
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

  const qualification = await Qualification.findById(id);
  if (!qualification) {
    throw new AppError(httpStatus.NOT_FOUND, 'Qualification is not found!');
  }

  const result = await Qualification.findByIdAndDelete(id);
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Qualification is not deleted!');
  }
  return result;
};

export const QualificationServices = {
  createIntoDB,
  getAllIntoDB,
  getAIntoDB,
  updateIntoDB,
  deleteAIntoDB,
};
