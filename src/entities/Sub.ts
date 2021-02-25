import { IsNotEmpty } from 'class-validator';
import { Field } from 'type-graphql';
import {
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
}
