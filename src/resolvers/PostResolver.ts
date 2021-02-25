import {
  Args,
  ArgsType,
  Ctx,
  Field,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from 'type-graphql';
import { Post } from '../entities/Post';
import { Sub } from '../entities/Sub';
import { User } from '../entities/User';
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

@ArgsType()
export class FetchPostArgs {
  @Field()
  identifier: string;
  @Field()
  slug: string;
}

@Resolver(Post)
export class PostResolver {
  @FieldResolver(() => User)
  creator(@Root() post: Post, @Ctx() { userLoader }: MyContext) {
    return userLoader.load(post.username);
  }

  @FieldResolver(() => Sub)
  sub(@Root() post: Post, @Ctx() { subLoader }: MyContext) {
    return subLoader.load(post.subName);
  }

  @Query(() => [Post])
  getPosts(): Promise<Post[]> {
    return Post.find({ order: { createdAt: 'DESC' } });
  }

  @Query(() => Post, { nullable: true })
  getPost(@Args() { identifier, slug }: FetchPostArgs) {
    return Post.findOne({ slug, identifier });
  }

  // Create post
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
