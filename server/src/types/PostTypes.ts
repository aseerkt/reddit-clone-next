import { Post } from '../entities/Post';
import { ArgsType, Field, ObjectType } from 'type-graphql';

@ArgsType()
export class CreatePostArgs {
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

@ObjectType()
export class PaginatedPost {
  @Field()
  hasMore: boolean;
  @Field(() => [Post])
  posts: Post[];
}
