import { Field, Int, ObjectType } from 'type-graphql';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseColumns } from './BaseColums';
import { Comment } from './Comment';
import { Post } from './Post';
import { User } from './User';

@ObjectType()
@Entity('votes')
export class Vote extends BaseColumns {
  constructor(vote: Partial<Vote>) {
    super();
    Object.assign(this, vote);
  }

  @Field(() => Int)
  @Column({ type: 'int' })
  value: 1 | -1;

  @Field()
  @Column()
  username: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'username', referencedColumnName: 'username' })
  user: User;

  @ManyToOne(() => Post, (post) => post.votes)
  post: Post;

  @ManyToOne(() => Comment, (comment) => comment.votes)
  comment: Comment;
}
