import { Field, ObjectType } from 'type-graphql';
import {
  AfterLoad,
  BeforeInsert,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { BaseColumns } from './BaseColums';
import { User } from './User';
import { Sub } from './Sub';
import { makeId, slugify } from '../utils/postHelper';
import { IsNotEmpty } from 'class-validator';
import { Comment } from './Comment';
import { Vote } from './Vote';

@ObjectType()
@Entity('posts')
export class Post extends BaseColumns {
  constructor(post: Partial<Post>) {
    super();
    Object.assign(this, post);
  }

  @Field()
  @Index()
  @Column()
  identifier: string;

  @Field()
  @Index()
  @Column()
  slug: string;

  @Field()
  @IsNotEmpty({ message: 'Title is required' })
  @Column()
  title: string;

  @Field()
  @Column({ nullable: true, type: 'text' })
  body: string;

  //  Virtual fields

  @Field()
  protected url: string;

  // Relations

  @Field()
  @Column()
  username: string;

  @Field()
  @Column()
  subName: string;

  @ManyToOne(() => User, (user) => user.posts)
  @JoinColumn({ name: 'username', referencedColumnName: 'username' })
  creator: User;

  @ManyToOne(() => Sub, (sub) => sub.posts)
  @JoinColumn({ name: 'subName', referencedColumnName: 'name' })
  sub: Sub;

  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];

  @OneToMany(() => Vote, (vote) => vote.post)
  votes: Vote[];

  // Methods
  @BeforeInsert()
  makeSlug() {
    this.identifier = makeId();
    this.slug = slugify(this.title);
  }

  @AfterLoad()
  createFields() {
    this.url = `/r/${this.subName}/${this.identifier}/${this.slug}`;
  }
}
