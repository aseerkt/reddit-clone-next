import {
  IsAlphanumeric,
  IsEmail,
  IsNotEmpty,
  MinLength,
} from 'class-validator';
import { Field, ObjectType } from 'type-graphql';
import argon2 from 'argon2';
import { Entity, Column, Index, BeforeInsert, OneToMany } from 'typeorm';
import { BaseColumns } from './BaseColums';
import { Post } from './Post';

@ObjectType()
@Entity('users')
export class User extends BaseColumns {
  constructor(user: Partial<User>) {
    super();
    Object.assign(this, user);
  }

  @Field()
  @IsEmail(undefined, { message: 'Invalid email' })
  @IsNotEmpty({ message: 'Email is required' })
  @Column({ unique: true })
  email: string;

  @Field()
  @Index()
  @IsAlphanumeric(undefined, { message: 'Username must be alphanumeric' })
  @MinLength(3, {
    message: 'Username must be $constraint1 or more characters long',
  })
  @IsNotEmpty({ message: 'Username is required' })
  @Column({ unique: true })
  username: string;

  @MinLength(6, {
    message: 'Password must be $constraint1 or more characters long',
  })
  @IsNotEmpty({ message: 'Password is required' })
  @Column()
  password: string;

  // Methods

  @BeforeInsert()
  async hashPassword() {
    this.password = await argon2.hash(this.password);
  }

  verifyPassword(password: string) {
    return argon2.verify(this.password, password);
  }

  // Relations

  @OneToMany(() => Post, (post) => post.creator)
  posts: Post[];
}
