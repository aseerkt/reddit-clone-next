import { AuthenticationError } from 'apollo-server-express';
import { MiddlewareFn } from 'type-graphql';
import { COOKIE_NAME } from '../constants';
import { User } from '../entities/User';
import { MyContext } from '../types';
import { verifyToken } from '../utils/tokenHandler';

export const isAuth: MiddlewareFn<MyContext> = async ({ context }, next) => {
  // console.log(context);
  try {
    const token = context.req.cookies[COOKIE_NAME];
    const payload: any = verifyToken(token);
    const username = payload.username;
    const user = await User.findOne({ username });
    if (!user) {
      throw new AuthenticationError('Not Authenticated');
    } else {
      context.res.locals.user = user;
    }
    return next();
  } catch (err) {
    console.log('Authentication Error', err);
    throw new AuthenticationError('Not Authenticated');
  }
};
