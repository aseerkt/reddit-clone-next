import { Arg, Ctx, Int, Mutation, Resolver, UseMiddleware } from 'type-graphql';
import { Comment } from '../entities/Comment';
import { Post } from '../entities/Post';
import { Vote } from '../entities/Vote';
import { isAuth } from '../middlewares/isAuth';
import { MyContext } from '../types';

@Resolver()
export class VoteResolver {
  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async votePost(
    @Arg('postId') postId: string,
    @Arg('value', () => Int) value: 1 | -1,
    @Ctx() { res }: MyContext
  ): Promise<boolean> {
    if (![-1, 1].includes(value)) return false;
    const user = res.locals.user;
    const post = await Post.findOne(postId);
    if (!post) return false;
    const vote = await Vote.findOne({ post, user });
    if (!vote) {
      await new Vote({ post, user, value }).save();
      return true;
    } else {
      if (vote.value === value) {
        await vote.remove();
        return true;
      } else {
        vote.value = value;
        await vote.save();
        return true;
      }
    }
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async voteComment(
    @Arg('commentId') commentId: string,
    @Arg('value', () => Int) value: -1 | 1,
    @Ctx() { res }: MyContext
  ): Promise<boolean> {
    if (![-1, 1].includes(value)) return false;
    const user = res.locals.user;
    const comment = await Comment.findOne({ id: commentId });
    if (!comment) return false;
    const vote = await Vote.findOne({ comment, user });
    if (!vote) {
      await new Vote({ user, comment, value }).save();
      return true;
    } else {
      if (vote.value === value) {
        await vote.remove();
        return true;
      } else {
        vote.value = value;
        await vote.save();
        return true;
      }
    }
  }
}
