import { CookieOptions, Request, Response } from 'express';
import { COOKIE_NAME, __prod__ } from '../constants';
import { User } from '../entities/User';
import { verifyToken } from './tokenHandler';

const COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  secure: __prod__,
  maxAge: 7 * 24 * 60 * 60 * 1000,
  sameSite: __prod__ ? 'none' : 'strict',
  path: '/',
};

export const setTokenToCookie = (res: Response, token: string) => {
  res.cookie(COOKIE_NAME, token, COOKIE_OPTIONS);
};

export const clearTokenCookie = (res: Response) => {
  res.clearCookie(COOKIE_NAME, COOKIE_OPTIONS);
};

export const getUserFromCookie = async (req: Request) => {
  const token = req.cookies[COOKIE_NAME];
  const payload: any = verifyToken(token);
  const username = payload.username;
  const user = await User.findOne({ username });
  if (user) return user;
  else return null;
};
