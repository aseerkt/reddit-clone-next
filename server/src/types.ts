import { Request, Response } from 'express';
import { Field, ObjectType } from 'type-graphql';
import { User } from './entities/User';
import { createSubLoader } from './utils/createSubLoader';
import { createUserLoader } from './utils/createUserLoader';

@ObjectType()
export class FieldError {
  @Field()
  path: string;
  @Field()
  message: string;
}

@ObjectType()
export class DefaultResponse {
  @Field()
  ok: boolean;
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];
}

export type MyContext = {
  req: Request;
  res: Response & { locals: { user: User } };
  userLoader: ReturnType<typeof createUserLoader>;
  subLoader: ReturnType<typeof createSubLoader>;
};
