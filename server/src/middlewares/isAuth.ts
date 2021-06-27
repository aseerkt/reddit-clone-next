import { AuthenticationError } from 'apollo-server-express';
import { MiddlewareFn } from 'type-graphql';
import { MyContext } from '../types';
import { getUserFromCookie } from '../utils/cookieHandler';

export const isAuth: MiddlewareFn<MyContext> = async ({ context }, next) => {
  // console.log(context);
  try {
    const user = await getUserFromCookie(context.req);
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
