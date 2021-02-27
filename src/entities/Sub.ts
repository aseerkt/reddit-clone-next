import { IsNotEmpty } from 'class-validator';
import { Field, ObjectType } from 'type-graphql';
import {
  AfterLoad,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { BaseColumns } from './BaseColums';
import { Post } from './Post';
import { User } from './User';

@ObjectType()
@Entity('subs')
export class Sub extends BaseColumns {
  constructor(sub: Partial<Sub>) {
    super();
    Object.assign(this, sub);
  }

  @Field()
  @Index()
  @IsNotEmpty({ message: 'Name is required' })
  @Column({ unique: true })
  name: string;

  @Field()
  @IsNotEmpty({ message: 'Title is required' })
  @Column()
  title: string;

  @Field()
  @Column({ type: 'text', nullable: true })
  description: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  imageUrn: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  bannerUrn: string;

  // Relations

  @Field()
  @Column()
  username: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'username', referencedColumnName: 'username' })
  owner: User;

  @OneToMany(() => Post, (post) => post.sub)
  posts: Post[];

  // VirtualFields
  @Field()
  protected imageUrl: string;
  @Field(() => String, { nullable: true })
  protected bannerUrl?: string | null;

  @AfterLoad()
  createUrls() {
    this.bannerUrl = this.bannerUrn
      ? `${process.env.APP_URL}/${this.bannerUrn}`
      : null;
    this.imageUrl = this.imageUrn
      ? `${process.env.APP_URL}/${this.imageUrn}`
      : 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y';
  }
}
