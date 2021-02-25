import { Response } from 'express';
import { COOKIE_NAME, __prod__ } from '../constants';

export const setTokenToCookie = (res: Response, token: string) => {
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: __prod__,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    sameSite: 'strict',
    path: '/',
  });
};
