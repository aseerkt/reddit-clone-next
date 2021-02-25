import { validate } from 'class-validator';
import {
  Args,
  ArgsType,
  Ctx,
  Field,
  Mutation,
  Resolver,
  UseMiddleware,
} from 'type-graphql';
import { getRepository } from 'typeorm';
import { Sub } from '../entities/Sub';
import { isAuth } from '../middlewares/isAuth';
import { DefaultResponse, MyContext } from '../types';
import { extractErrors } from '../utils/extractErrors';

@ArgsType()
class CreateSubArgs {
  @Field()
  name: string;
  @Field()
  title: string;
  @Field({ nullable: true })
  description?: string;
}

@Resolver()
export class SubResolver {
  @Mutation(() => DefaultResponse)
  @UseMiddleware(isAuth)
  async createSub(
    @Args() { name, title, description }: CreateSubArgs,
    @Ctx() { res }: MyContext
  ): Promise<DefaultResponse> {
    const user = res.locals.user;
    // let errors: FieldError[] = [];
    try {
      // validate input data
      const sub = new Sub({ name, title, description, owner: user });
      const validationErrors = await validate(sub);
      if (validationErrors.length > 0) {
        return { ok: false, errors: extractErrors(validationErrors) };
      }
      // check if sub already exist
      const existingSub = await getRepository(Sub)
        .createQueryBuilder('sub')
        .where('lower(sub.name) = :name', { name: name.toLowerCase() })
        .getOne();
      if (existingSub)
        return {
          ok: false,
          errors: [{ path: 'name', message: 'Name is already taken' }],
        };

      // save sub
      await sub.save();
      return { ok: true };
    } catch (err) {
      console.log(err);
      return {
        ok: false,
        errors: [{ path: 'unknown', message: 'Something went wrong' }],
      };
    }
  }
}
