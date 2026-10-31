import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { BlogServices } from './blogs.service';

const addBlog = catchAsync(async (req, res) => {
  const blog = await BlogServices.createIntoDB(req.body, req.user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'New blog added successfully!',
    data: blog,
  });
});

const publishBlog = catchAsync(async (req, res) => {
  const blog = await BlogServices.publishedBlog(req.body, req.user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'New blog published successfully!',
    data: blog,
  });
});

const getAllBlogs = catchAsync(async (req, res) => {
  const result = await BlogServices.getAllIntoDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All blogs retrieve successfully!',
    meta: result.meta,
    data: result.result,
  });
});

const getAllMyBlogs = catchAsync(async (req, res) => {
  const result = await BlogServices.getAllMyIntoDB(req.query, req.user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All my blogs retrieve successfully!',
    meta: result.meta,
    data: result.result,
  });
});

const getABlog = catchAsync(async (req, res) => {
  const id = req.params.id as string;
  const blog = await BlogServices.getAIntoDB(id, req.user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Blog retrieve successfully!',
    data: blog,
  });
});

const updateABlog = catchAsync(async (req, res) => {
  const id = req.params.id as string;
  const blog = await BlogServices.updateIntoDB(id, req.body, req.user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Update a blog successfully!',
    data: blog,
  });
});

const deleteABlog = catchAsync(async (req, res) => {
  const id = req.params.id as string;
  const blog = await BlogServices.deleteAIntoDB(id, req.user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Delete a blog successfully!',
    data: blog,
  });
});

export const blogControllers = {
  addBlog,
  publishBlog,
  getAllBlogs,
  getAllMyBlogs,
  getABlog,
  updateABlog,
  deleteABlog,
};
