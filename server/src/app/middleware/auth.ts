import { NextFunction, Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import AppError from '../errors/AppError';
import httpStatus from 'http-status';
import config from '../config';
import { User } from '../modules/user/user.model';
import { TUserRole } from '../modules/user/user.interface';
import { ACCESS_COOKIE, verifyToken } from '../modules/Auth/auth.utils';

/**
 * Reads the access token from the httpOnly session cookie and checks that the
 * user still exists, is active, and has not revoked the session (tokenVersion).
 */
const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies?.[ACCESS_COOKIE];
    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'Unauthorized Access');
    }

    let decoded;
    try {
      decoded = verifyToken(token, config.jwt_access_secret as string);
    } catch {
      throw new AppError(httpStatus.UNAUTHORIZED, 'Unauthorized Access');
    }
    if (decoded.typ !== 'access' || !decoded._id) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'Unauthorized Access');
    }

    const user = await User.findById(decoded._id);
    if (
      !user ||
      user.isDeleted ||
      user.status === 'blocked' ||
      (user.tokenVersion ?? 0) !== decoded.tv
    ) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'Unauthorized Access');
    }

    // Role comes from the database, not the token, so a role change applies immediately.
    if (requiredRoles.length && !requiredRoles.includes(user.role)) {
      throw new AppError(httpStatus.FORBIDDEN, 'You are not authorized!');
    }

    req.user = { ...decoded, _id: String(user._id), email: user.email, role: user.role };
    next();
  });
};

export default auth;
