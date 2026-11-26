import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { MessageServices } from './message.service';
import { TMessageListQuery } from './message.interface';

const createMessage = catchAsync(async (req, res) => {
  await MessageServices.createMessage(req.body);

  // Same answer for honeypot hits, so bots cannot tell they were filtered.
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Message received',
    data: null,
  });
});

const listMessages = catchAsync(async (req, res) => {
  const result = await MessageServices.listMessages(req.query as TMessageListQuery);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Messages retrieved successfully!',
    meta: result.meta,
    data: result.data,
  });
});

const updateMessage = catchAsync(async (req, res) => {
  const result = await MessageServices.updateMessage(String(req.params.id), req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Message updated',
    data: result,
  });
});

const deleteMessage = catchAsync(async (req, res) => {
  await MessageServices.deleteMessage(String(req.params.id));

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Message deleted',
    data: null,
  });
});

export const MessageControllers = { createMessage, listMessages, updateMessage, deleteMessage };
