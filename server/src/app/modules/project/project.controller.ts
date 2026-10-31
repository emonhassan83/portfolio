import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { ProjectServices } from "./project.service";

const addProject = catchAsync(async (req, res) => {
    const project = await ProjectServices.createIntoDB(req.body, req.user);
  
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'New project added successfully!',
      data: project,
    });
  });

  const getAllProjects = catchAsync(async (req, res) => {
    const result = await ProjectServices.getAllIntoDB(req.query);
  
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'All projects retrieve successfully!',
      meta: result.meta,
      data: result.result,
    });
  });

  const getAProject = catchAsync(async (req, res) => {
    const id = req.params.id as string;
    const project = await ProjectServices.getAIntoDB(id, req.user);
  
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Project retrieve successfully!',
      data: project,
    });
  });

  const updateAProject = catchAsync(async (req, res) => {
    const id = req.params.id as string;
    const project = await ProjectServices.updateIntoDB(
      id,
      req.body,
      req.user,
    );
  
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Update a project successfully!',
      data: project,
    });
  });

  const deleteAProject = catchAsync(async (req, res) => {
    const id = req.params.id as string;
    const project = await ProjectServices.deleteAIntoDB(id, req.user);
  
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Delete a project successfully!',
      data: project,
    });
  });

  export const projectControllers = {
    addProject,
    getAllProjects,
    getAProject,
    updateAProject,
    deleteAProject
  };