import { validate } from 'class-validator';
import {
  Arg,
  Args,
  ArgsType,
  Ctx,
  Field,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  UseMiddleware,
} from 'type-graphql';
import { User } from '../entities/User';
import { FieldError, MyContext } from '../types';
import { setTokenToCookie } from '../utils/cookieHandler';
import { extractErrors } from '../utils/extractErrors';
import { createToken } from '../utils/tokenHandler';
import { isUser } from '../middlewares/isUser';
import { isAuth } from '../middlewares/isAuth';
import { COOKIE_NAME } from '../constants';

@ArgsType()
class RegisterArgs {
  @Field()
  email: string;

  @Field()
  username: string;

  @Field()
  password: string;
}
@ObjectType()
class UserResponse {
  @Field(() => User, { nullable: true })
  user?: User;
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];
}

@Resolver()
export class UserResolver {
  @Query(() => String)
  hello() {
    return 'Hi';
  }

  @Query(() => User, { nullable: true })
  @UseMiddleware(isUser)
  me(@Ctx() { res }: MyContext) {
    return res.locals.user;
  }

  @Mutation(() => UserResponse)
  async register(
    @Args() { email, username, password }: RegisterArgs
  ): Promise<UserResponse> {
    try {
      let errors: FieldError[] = [];
      // validate user data
      const emailUser = await User.findOne({ email });
      const usernameUser = await User.findOne({ username });

      if (emailUser)
        errors.push({ path: email, message: 'Email is already taken' });
      if (usernameUser)
        errors.push({
          path: username,
          message: 'Username is already taken',
        });

      if (errors.length > 0) return { errors };

      const user = new User({ email, username, password });
      const validationErrors = await validate(user);
      if (validationErrors.length > 0) {
        return { errors: extractErrors(validationErrors) };
      }
      await user.save();
      return { user };
    } catch (err) {
      return { errors: [{ path: 'unknown', message: 'Something went wrong' }] };
    }
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg('usernameOrEmail') usernameOrEmail: string,
    @Arg('password') password: string,
    @Ctx() { res }: MyContext
  ) {
    try {
      const user = await User.findOne(
        usernameOrEmail.includes('@')
          ? { email: usernameOrEmail }
          : { username: usernameOrEmail }
      );
      if (!user) {
        console.log('No user');
        return {
          errors: [{ path: 'unknown', message: 'Incorrect Credentials' }],
        };
      }
      const valid = await user.verifyPassword(password);
      if (!valid) {
        return {
          errors: [{ path: 'unknown', message: 'Incorrect Credentials' }],
        };
      }
      setTokenToCookie(res, createToken(user));
      return { user };
    } catch (err) {
      return { errors: [{ path: 'unknown', message: 'Something went wrong' }] };
    }
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  logout(@Ctx() { res }: MyContext) {
    return new Promise((resolve) => {
      res.clearCookie(COOKIE_NAME, (err: any) => {
        if (err) {
          console.log(err);
          resolve(false);
        }
        res.locals.user = null as any;
        resolve(true);
      });
    });
  }
}
