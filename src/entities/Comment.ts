import { Field, ObjectType } from 'type-graphql';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseColumns } from './BaseColums';
import { Post } from './Post';
import { User } from './User';
import { Vote } from './Vote';

@ObjectType()
@Entity('comments')
export class Comment extends BaseColumns {
  constructor(comment: Partial<Comment>) {
    super();
    Object.assign(this, comment);
  }

  @Field()
  @Column()
  text: string;

  // Relations

  @Field()
  @Column()
  username: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'username', referencedColumnName: 'username' })
  user: User;

  @ManyToOne(() => Post, (post) => post.comments)
  post: Post;

  @OneToMany(() => Vote, (vote) => vote.comment)
  votes: Vote[];
}
