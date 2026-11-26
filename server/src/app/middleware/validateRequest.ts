import { NextFunction, Request, Response } from 'express';
import { ZodType } from 'zod';
import catchAsync from '../utils/catchAsync';

type TValidateOptions = {
  /** Replace req.body with the parsed value, dropping keys the schema does not declare. */
  strip?: boolean;
};

const zodValidationRequest = (schema: ZodType, options: TValidateOptions = {}) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const parsed = (await schema.parseAsync({
      body: req.body,
      params: req.params,
      query: req.query,
      cookies: req.cookies,
    })) as { body?: unknown };

    if (options.strip && parsed && 'body' in parsed) {
      req.body = parsed.body;
    }
    next();
  });
};

export default zodValidationRequest;
