import { validate } from 'class-validator';
import {
  Args,
  ArgsType,
  Field,
  Mutation,
  ObjectType,
  Resolver,
} from 'type-graphql';
import { User } from '../entities/User';
import { extractErrors } from '../utils/extractErrors';

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
  @Field({ nullable: true })
  errors?: Record<string, string>;
}

@Resolver()
export class AuthResolver {
  @Mutation(() => UserResponse)
  async register(
    @Args() { email, username, password }: RegisterArgs
  ): Promise<UserResponse> {
    try {
      let errors: Record<string, string> = {};
      // validate user data
      const emailUser = await User.findOne({ email });
      const usernameUser = await User.findOne({ username });

      if (emailUser) errors.email = 'Email is already taken';
      if (usernameUser) errors.username = 'Username is already taken';

      const user = new User({ email, username, password });
      const validationErrors = await validate(user);
      if (validationErrors.length > 0) {
        errors = { ...errors, ...extractErrors(validationErrors) };
      }
      if (Object.keys(errors).length > 0) {
        return { errors };
      }
      // create the user
      await user.save();
      return { user };
    } catch (err) {
      throw { errors: { unknown: 'Something went wrong' } };
    }
  }
}
