import { MiddlewareFn } from 'type-graphql';
import { MyContext } from '../types';
import { getUserFromCookie } from '../utils/cookieHandler';

export const isUser: MiddlewareFn<MyContext> = async ({ context }, next) => {
  try {
    const user = await getUserFromCookie(context.req);
    if (user) {
      context.res.locals.user = user;
    }
  } catch (err) {
    console.log('Authentication Error', err);
  }
  return next();
};
