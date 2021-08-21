import { FileUpload, GraphQLUpload } from "graphql-upload";
import { ArgsType, Field, ObjectType } from "type-graphql";

@ArgsType()
export class CreateSubArgs {
  @Field()
  name: string;
  @Field()
  title: string;
  @Field({ nullable: true })
  description?: string;
}

@ArgsType()
export class AddSubImageArgs {
  @Field(() => GraphQLUpload)
  file: FileUpload;
  @Field()
  type: 'banner' | 'image';
  @Field()
  subName: string;
}

@ObjectType()
export class AddSubImageResponse {
  @Field()
  type: 'banner' | 'image';
  @Field()
  Urn: string;
}

@ObjectType()
export class TopSub {
  @Field()
  name: string;
  @Field()
  title: string;
  @Field()
  imageUrl: string;
  @Field()
  postCount: string;
}