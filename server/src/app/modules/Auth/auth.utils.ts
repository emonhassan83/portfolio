import { CookieOptions, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../../config';

/** `typ` stops one kind of token (e.g. a reset link) being replayed as another. */
export type TTokenType = 'access' | 'refresh' | 'challenge' | 'reset';

export type TTokenPayload = {
  _id: string;
  email: string;
  role: string;
  tv: number;
  typ: TTokenType;
};

export const createToken = (
  payload: TTokenPayload,
  secret: string,
  expiresIn: string,
) => {
  return jwt.sign(payload, secret, {
    expiresIn: expiresIn as jwt.SignOptions['expiresIn'],
  });
};

export const verifyToken = (token: string, secret: string) => {
  return jwt.verify(token, secret) as JwtPayload & Partial<TTokenPayload>;
};

export const ACCESS_COOKIE = 'access_token';
export const REFRESH_COOKIE = 'refresh_token';
/** The refresh cookie is only sent to auth endpoints. */
const REFRESH_PATH = '/api/auth';

const baseCookie = (): CookieOptions => ({
  httpOnly: true,
  secure: config.is_production,
  sameSite: 'strict',
});

/** Cookie lifetime follows the token's own `exp`. */
const maxAgeOf = (token: string) => {
  const { exp } = jwt.decode(token) as JwtPayload;
  return exp ? Math.max(0, exp * 1000 - Date.now()) : undefined;
};

export const setSessionCookies = (
  res: Response,
  tokens: { accessToken: string; refreshToken?: string },
) => {
  res.cookie(ACCESS_COOKIE, tokens.accessToken, {
    ...baseCookie(),
    path: '/',
    maxAge: maxAgeOf(tokens.accessToken),
  });
  if (tokens.refreshToken) {
    res.cookie(REFRESH_COOKIE, tokens.refreshToken, {
      ...baseCookie(),
      path: REFRESH_PATH,
      maxAge: maxAgeOf(tokens.refreshToken),
    });
  }
};

export const clearSessionCookies = (res: Response) => {
  res.clearCookie(ACCESS_COOKIE, { ...baseCookie(), path: '/' });
  res.clearCookie(REFRESH_COOKIE, { ...baseCookie(), path: REFRESH_PATH });
};

/** Case, surrounding and repeated whitespace do not matter for security answers. */
export const normalizeAnswer = (answer: string) =>
  answer.trim().toLowerCase().replace(/\s+/g, ' ');
