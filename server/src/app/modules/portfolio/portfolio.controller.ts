import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { PortfolioServices } from './portfolio.service';
import { TPortfolioResource } from './portfolio.interface';

const resourceOf = (params: Record<string, unknown>) => params.resource as TPortfolioResource;

const getPublicPortfolio = catchAsync(async (req, res) => {
  const result = await PortfolioServices.getPublicPortfolio();
  res.set('Cache-Control', 'public, max-age=0, s-maxage=60, stale-while-revalidate=300');

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Portfolio retrieved successfully!',
    data: result,
  });
});

const getProfile = catchAsync(async (req, res) => {
  const result = await PortfolioServices.getProfile();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Profile retrieved successfully!',
    data: result,
  });
});

const updateProfile = catchAsync(async (req, res) => {
  const result = await PortfolioServices.updateProfile(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Profile saved!',
    data: result,
  });
});

const listResource = catchAsync(async (req, res) => {
  const result = await PortfolioServices.listResource(resourceOf(req.params));

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Items retrieved successfully!',
    data: result,
  });
});

const createResource = catchAsync(async (req, res) => {
  const result = await PortfolioServices.createResource(resourceOf(req.params), req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Item created!',
    data: result,
  });
});

const updateResource = catchAsync(async (req, res) => {
  const result = await PortfolioServices.updateResource(
    resourceOf(req.params),
    req.params.id as string,
    req.body,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Item saved!',
    data: result,
  });
});

const deleteResource = catchAsync(async (req, res) => {
  await PortfolioServices.deleteResource(resourceOf(req.params), req.params.id as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Item deleted!',
    data: null,
  });
});

const reorderResource = catchAsync(async (req, res) => {
  const result = await PortfolioServices.reorderResource(resourceOf(req.params), req.body.ids);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Order saved!',
    data: result,
  });
});

const importAll = catchAsync(async (req, res) => {
  const result = await PortfolioServices.importAll(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Default content imported!',
    data: result,
  });
});

export const PortfolioControllers = {
  getPublicPortfolio,
  getProfile,
  updateProfile,
  listResource,
  createResource,
  updateResource,
  deleteResource,
  reorderResource,
  importAll,
};
