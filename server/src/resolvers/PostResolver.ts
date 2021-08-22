import {
  CreatePostArgs,
  FetchPostArgs,
  PaginatedPost,
} from '../types/PostTypes';
import {
  Arg,
  Args,
  Ctx,
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
    return Comment.find({ where: { post }, order: { createdAt: 'DESC' } });
  }

  //CommentCount

  @FieldResolver(() => Int)
  commentCount(@Root() post: Post) {
    return Comment.count({ post });
  }

  //PostScore
  @FieldResolver(() => Int)
  async voteScore(@Root() post: Post) {
    const votes = await Vote.find({ post });
    return votes.reduce((prev, vote) => {
      prev += vote.value;
      return prev;
    }, 0);
  }

  //UserVote
  @FieldResolver(() => Int, { nullable: true })
  @UseMiddleware(isUser)
  async userVote(
    @Root() post: Post,
    @Ctx() { res }: MyContext
  ): Promise<number | null> {
    const vote = await Vote.findOne({
      select: ['value'],
      where: { post, user: res.locals.user },
    });
    return vote ? vote.value : null;
  }

  @Query(() => PaginatedPost)
  async getPosts(
    @Arg('limit', () => Int) limit: number,
    @Arg('offset', () => Int) offset: number
  ): Promise<PaginatedPost> {
    const posts = await Post.find({
      skip: offset,
      take: limit + 1,
      order: { createdAt: 'DESC' },
    });
    return {
      hasMore: posts.length === limit + 1,
      posts: posts.slice(0, limit + 1),
    };
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
