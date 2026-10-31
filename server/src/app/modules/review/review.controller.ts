import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { ReviewServices } from './review.service';

const addReview = catchAsync(async (req, res) => {
  const review = await ReviewServices.createIntoDB(req.body, req.user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'New review added successfully!',
    data: review,
  });
});

const getAllReviews = catchAsync(async (req, res) => {
  const result = await ReviewServices.getAllIntoDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All reviews retrieve successfully!',
    meta: result.meta,
    data: result.result,
  });
});

const getAllMyReviews = catchAsync(async (req, res) => {
  const result = await ReviewServices.getAllMyIntoDB(req.query, req.user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All my reviews retrieve successfully!',
    meta: result.meta,
    data: result.result,
  });
});

const getAReview = catchAsync(async (req, res) => {
  const id = req.params.id as string;
  const review = await ReviewServices.getAIntoDB(id, req.user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Review retrieve successfully!',
    data: review,
  });
});

const updateAReview = catchAsync(async (req, res) => {
  const id = req.params.id as string;
  const review = await ReviewServices.updateIntoDB(id, req.body, req.user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Update a review successfully!',
    data: review,
  });
});

const deleteAReview = catchAsync(async (req, res) => {
  const id = req.params.id as string;
  const review = await ReviewServices.deleteAIntoDB(id, req.user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Delete a review successfully!',
    data: review,
  });
});

export const reviewControllers = {
  addReview,
  getAllReviews,
  getAllMyReviews,
  getAReview,
  updateAReview,
  deleteAReview,
};
