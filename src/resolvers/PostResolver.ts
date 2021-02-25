import {
  Args,
  ArgsType,
  Ctx,
  Field,
  Mutation,
  Resolver,
  UseMiddleware,
} from 'type-graphql';
import { Post } from '../entities/Post';
import { isAuth } from '../middlewares/isAuth';
import { DefaultResponse, MyContext } from '../types';

@ArgsType()
class CreatePostArgs {
  @Field()
  title!: string;
  @Field({ nullable: true })
  body?: string;
  @Field()
  subName: string;
}

@Resolver()
export class PostResolver {
  @Mutation(() => DefaultResponse)
  @UseMiddleware(isAuth)
  async createPost(
    @Args() { title, body, subName }: CreatePostArgs,
    @Ctx() { res }: MyContext
  ): Promise<DefaultResponse> {
    const user = res.locals.user;
    try {
      const post = new Post({ title, body, subName, username: user.username });
      await post.save();
      return { ok: true };
    } catch (err) {
      console.log(err);
      if ((err.code = '23503') && err.detail.includes('subName')) {
        // TODO: Sub not found error
        // return {
        //   ok: false,
        //   errors: [{ path: 'subName', message: 'Sub do not found' }],
        // };
      }
      return {
        ok: false,
        errors: [{ path: 'unknown', message: 'Something went wrong' }],
      };
    }
  }
}
