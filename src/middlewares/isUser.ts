import { MiddlewareFn } from 'type-graphql';
import { COOKIE_NAME } from '../constants';
import { User } from '../entities/User';
import { MyContext } from '../types';
import { verifyToken } from '../utils/tokenHandler';

export const isUser: MiddlewareFn<MyContext> = async ({ context }, next) => {
  try {
    const token = context.req.cookies[COOKIE_NAME];
    // console.log(token);
    const payload: any = verifyToken(token);
    const username = payload.username;
    const user = await User.findOne({ username });
    if (user) {
      context.res.locals.user = user;
    }
  } catch (err) {
    console.log('Authentication Error', err);
  }
  return next();
};
