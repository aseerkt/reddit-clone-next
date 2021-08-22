import { ArgsType, Field } from 'type-graphql';

@ArgsType()
export class RegisterArgs {
  @Field()
  email: string;

  @Field()
  username: string;

  @Field()
  password: string;
}
