import { JwtPayload } from 'jsonwebtoken';
import { User } from '../user/user.model';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import { TBlog } from './blogs.interface';
import { Blog } from './blogs.model';
import { BlogsSearchableFields } from './blogs.constant';

const createIntoDB = async (blog: TBlog, userData: JwtPayload) => {
  // const { author } = blog;
  //* checking if the user is exist
  const user = await User.isUserExistsByEmail(userData?.email);
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

  const result = await Blog.create(blog);
  return result;
};

const publishedBlog = async (id: string, userData: JwtPayload) => {
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

  const blog = await Blog.findById(id);
  if (!blog) {
    throw new AppError(httpStatus.NOT_FOUND, 'Blog is not found!');
  }

  const result = await Blog.findByIdAndUpdate(
    id,
    { isPublished: true },
    {
      new: true,
    },
  );
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Blog is not updated!');
  }
  return result;
};

const getAllIntoDB = async (query: Record<string, unknown>) => {
  const blogQuery = new QueryBuilder(Blog.find().populate("author"), query)
    .search(BlogsSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await blogQuery.modelQuery;
  const meta = await blogQuery.countTotal();
  return {
    meta,
    result,
  };
};

const getAllMyIntoDB = async (
  query: Record<string, unknown>,
  userData: JwtPayload,
) => {
  const user = await User.isUserExistsByUserEmail(userData.email);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
  }

  const userId = user._id;
  const blogQuery = new QueryBuilder(Blog.find({ author: userId }).populate("author"), query)
    .search(BlogsSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await blogQuery.modelQuery;
  const meta = await blogQuery.countTotal();
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

  const result = await Blog.findById(id);
  return result;
};

const updateIntoDB = async (
  id: string,
  payload: Partial<TBlog>,
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

  const blog = await Blog.findById(id);
  if (!blog) {
    throw new AppError(httpStatus.NOT_FOUND, 'Blog is not found!');
  }

  const result = await Blog.findByIdAndUpdate(id, payload, {
    new: true,
  });
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Blog is not updated!');
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

  const blog = await Blog.findById(id);
  if (!blog) {
    throw new AppError(httpStatus.NOT_FOUND, 'Blog is not found!');
  }

  const result = await Blog.findByIdAndDelete(id);
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Blog is not deleted!');
  }
  return result;
};

export const BlogServices = {
  createIntoDB,
  publishedBlog,
  getAllIntoDB,
  getAllMyIntoDB,
  getAIntoDB,
  updateIntoDB,
  deleteAIntoDB,
};
