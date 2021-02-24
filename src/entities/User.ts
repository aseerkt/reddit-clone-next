import { IsAlphanumeric, IsEmail, MinLength } from 'class-validator';
import { Field, ObjectType } from 'type-graphql';
import argon2 from 'argon2';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
} from 'typeorm';

@ObjectType()
@Entity('users')
export class User extends BaseEntity {
  constructor(user: Partial<User>) {
    super();
    Object.assign(this, user);
  }

  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Index()
  @IsEmail(undefined, { message: 'Invalid email' })
  @Column({ unique: true })
  email: string;

  @Field()
  @IsAlphanumeric(undefined, { message: 'Username must be alphanumeric' })
  @MinLength(3, {
    message: 'Username must be $constraint1 or more characters long',
  })
  @Column({ unique: true })
  username: string;

  @MinLength(6, {
    message: 'Password must be $constraint1 or more characters long',
  })
  @Column()
  password: string;

  @Field(() => Date)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  async hashPassword() {
    this.password = await argon2.hash(this.password);
  }
}
