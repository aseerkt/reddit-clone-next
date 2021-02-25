import { Request, Response } from 'express';
import { Field, ObjectType } from 'type-graphql';
import { User } from './entities/User';

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
};
