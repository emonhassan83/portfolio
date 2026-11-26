import { ZodError } from 'zod';
import { TErrorSources, TGenericErrorResponse } from '../interface/error';

const handleZodError = (err: ZodError): TGenericErrorResponse => {
  const errorSources: TErrorSources = err.issues.map((issue) => {
    const last = issue.path[issue.path.length - 1];
    return {
      path: typeof last === 'number' ? last : String(last ?? ''),
      message: issue.message,
    };
  });

  return {
    statusCode: 400,
    message: 'Validation error',
    errorSources,
  };
};

export default handleZodError;
