import {
  Arg,
  Args,
  Ctx,
  Mutation,
  Resolver,
  UseMiddleware,
} from 'type-graphql';
import { Comment } from '../entities/Comment';
import { Post } from '../entities/Post';
import { isAuth } from '../middlewares/isAuth';
import { MyContext } from '../types';
import { FetchPostArgs } from './PostResolver';

@Resolver()
export class CommentResolver {
  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async commentPost(
    @Args() { identifier, slug }: FetchPostArgs,
    @Arg('text') text: string,
    @Ctx() { res }: MyContext
  ): Promise<boolean> {
    const user = res.locals.user;
    try {
      const post = await Post.findOne({ slug, identifier });
      if (!post) return false;
      const comment = new Comment({ text, user, post });
      await comment.save();
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }
}
