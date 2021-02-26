import {
  Args,
  ArgsType,
  Ctx,
  Field,
  FieldResolver,
  Int,
  Mutation,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from 'type-graphql';
import { Comment } from '../entities/Comment';
import { Post } from '../entities/Post';
import { Sub } from '../entities/Sub';
import { User } from '../entities/User';
import { Vote } from '../entities/Vote';
import { isAuth } from '../middlewares/isAuth';
import { isUser } from '../middlewares/isUser';
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
  // Creator
  @FieldResolver(() => User)
  creator(@Root() post: Post, @Ctx() { userLoader }: MyContext) {
    return userLoader.load(post.username);
  }

  //Sub
  @FieldResolver(() => Sub)
  sub(@Root() post: Post, @Ctx() { subLoader }: MyContext) {
    return subLoader.load(post.subName);
  }

  //Comments
  @FieldResolver(() => [Comment])
  comments(@Root() post: Post) {
    return Comment.find({ post });
  }

  //CommentCount

  @FieldResolver(() => Int)
  commentCount(@Root() post: Post) {
    return Comment.count({ post });
  }

  //VoteScore
  @FieldResolver(() => Int)
  async voteScore(@Root() post: Post) {
    const votes = await Vote.find({ post });
    return votes.reduce((prev, vote) => {
      prev += vote.value;
      return prev;
    }, 0);
  }

  //UserVote
  @FieldResolver(() => Int)
  @UseMiddleware(isUser)
  async userVote(@Root() post: Post, @Ctx() { res }: MyContext) {
    const vote = await Vote.findOne({
      select: ['value'],
      where: { post, user: res.locals.user },
    });
    return vote ? vote.value : null;
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
