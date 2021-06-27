import {
  Arg,
  Ctx,
  FieldResolver,
  Mutation,
  Resolver,
  Root,
  UseMiddleware,
} from 'type-graphql';
import { Comment } from '../entities/Comment';
import { Post } from '../entities/Post';
import { Vote } from '../entities/Vote';
import { isAuth } from '../middlewares/isAuth';
import { isUser } from '../middlewares/isUser';
import { MyContext } from '../types';

@Resolver(Comment)
export class CommentResolver {
  @FieldResolver(() => Number)
  async voteScore(@Root() comment: Comment): Promise<number> {
    const votes = await Vote.find({ comment });
    return votes.reduce((prev, curr) => {
      prev += curr.value;
      return prev;
    }, 0);
  }

  @FieldResolver(() => Number, { nullable: true })
  @UseMiddleware(isUser)
  async userVote(
    @Root() comment: Comment,
    @Ctx() { res }: MyContext
  ): Promise<number | null> {
    const vote = await Vote.findOne(
      { comment, user: res.locals.user },
      { select: ['value'] }
    );
    return vote ? vote.value : null;
  }

  // @Query(() => [Comment])
  // getComments(@Arg('postId') postId: string) {
  //   return Comment.find({ where: { postId }, order: { createdAt: 'DESC' } });
  // }

  @Mutation(() => Comment, { nullable: true })
  @UseMiddleware(isAuth)
  async commentPost(
    @Arg('postId') postId: string,
    @Arg('text') text: string,
    @Ctx() { res }: MyContext
  ): Promise<Comment | null> {
    const user = res.locals.user;
    try {
      const post = await Post.findOne(postId);
      if (!post) return null;
      const comment = new Comment({ text, user, post });
      await comment.save();
      return comment;
    } catch (err) {
      console.log(err);
      return null;
    }
  }
}
