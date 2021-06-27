import { Request, Response } from 'express';
import { COOKIE_NAME, __prod__ } from '../constants';
import { User } from '../entities/User';
import { verifyToken } from './tokenHandler';

export const setTokenToCookie = (res: Response, token: string) => {
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: __prod__,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    sameSite: 'strict',
    path: '/',
  });
};

export const getUserFromCookie = async (req: Request) => {
  const token = req.cookies[COOKIE_NAME];
  const payload: any = verifyToken(token);
  const username = payload.username;
  const user = await User.findOne({ username });
  if (user) return user;
  else return null;
};
