import { validate } from 'class-validator';
import {
  Arg,
  Args,
  ArgsType,
  Ctx,
  Field,
  FieldResolver,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from 'type-graphql';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { getConnection, getRepository } from 'typeorm';
import { Post } from '../entities/Post';
import { Sub } from '../entities/Sub';
import { isAuth } from '../middlewares/isAuth';
import { DefaultResponse, MyContext } from '../types';
import { extractErrors } from '../utils/extractErrors';
import { getUserFromCookie } from '../utils/cookieHandler';
import { AuthenticationError } from 'apollo-server-express';
import { uploadFile } from '../utils/uploadFile';
import { unlinkSync } from 'fs';
import { SUB_DEFAULT_IMAGE_URL } from '../constants';

@ArgsType()
class CreateSubArgs {
  @Field()
  name: string;
  @Field()
  title: string;
  @Field({ nullable: true })
  description?: string;
}

@ArgsType()
class AddSubImageArgs {
  @Field(() => GraphQLUpload)
  file: FileUpload;
  @Field()
  type: 'banner' | 'image';
  @Field()
  subName: string;
}

@ObjectType()
class AddSubImageResponse {
  @Field()
  type: 'banner' | 'image';
  @Field()
  Urn: string;
}

@ObjectType()
class TopSub {
  @Field()
  name: string;
  @Field()
  title: string;
  @Field()
  imageUrl: string;
  @Field()
  postCount: string;
}

@Resolver(Sub)
export class SubResolver {
  @FieldResolver(() => [Post])
  posts(@Root() sub: Sub) {
    return Post.find({
      where: { subName: sub.name },
      order: { createdAt: 'DESC' },
    });
  }

  @Mutation(() => AddSubImageResponse)
  async addSubImage(
    @Args() { file, subName, type }: AddSubImageArgs,
    @Ctx() { req, subLoader }: MyContext
  ): Promise<AddSubImageResponse> {
    const user = await getUserFromCookie(req);
    if (!user) {
      throw new AuthenticationError('Not Authenticated');
    }
    const sub = await subLoader.load(subName);
    if (!sub) {
      throw new Error('Sub not found');
    }
    if (sub.username !== user.username) {
      throw new Error('Unauthorized');
    }
    const { isUploaded, Urn, error } = await uploadFile(file, 'image');
    if (error) {
      throw new Error(`Upload failed: error`);
    }
    if (isUploaded && Urn) {
      if (type === 'image') {
        if (sub.imageUrn) {
          unlinkSync('public/' + sub.imageUrn);
        }
        sub.imageUrn = Urn;
      } else {
        if (sub.bannerUrn) {
          unlinkSync('public/' + sub.bannerUrn);
        }
        sub.bannerUrn = Urn;
      }

      await sub.save();
      return { Urn, type };
    } else {
      throw new Error('Something went wrong');
    }
  }

  @Query(() => [TopSub])
  async getTopSubs() {
    const imgUrlExp = `COALESCE('${process.env.APP_URL}/' || s."imageUrn", '${SUB_DEFAULT_IMAGE_URL}')`;
    const subs = await getConnection()
      .createQueryBuilder()
      .select(
        `s.name, s.title, ${imgUrlExp} as "imageUrl", count(p.id) as "postCount"`
      )
      .from(Sub, 's')
      .leftJoin(Post, 'p', 's.name = p."subName"')
      .groupBy('s.name, s.title, "imageUrl"')
      .orderBy('"postCount"', 'DESC')
      .limit(5)
      .execute();
    return subs;
  }

  @Query(() => Sub, { nullable: true })
  getSub(@Arg('subName') subName: string, @Ctx() { subLoader }: MyContext) {
    return subLoader.load(subName);
  }

  @Query(() => [Sub])
  async searchSub(@Arg('term') term: string) {
    return await getConnection()
      .createQueryBuilder(Sub, 'sub')
      .where('lower(sub.name) LIKE :term', {
        term: `${term.toLowerCase().trim()}%`,
      })
      .getMany();
  }
  @Mutation(() => DefaultResponse)
  @UseMiddleware(isAuth)
  async createSub(
    @Args() { name, title, description }: CreateSubArgs,
    @Ctx() { res }: MyContext
  ): Promise<DefaultResponse> {
    const user = res.locals.user;
    // let errors: FieldError[] = [];
    try {
      // validate input data
      const sub = new Sub({ name, title, description, owner: user });
      const validationErrors = await validate(sub);
      if (validationErrors.length > 0) {
        return { ok: false, errors: extractErrors(validationErrors) };
      }
      // check if sub already exist
      const existingSub = await getRepository(Sub)
        .createQueryBuilder('sub')
        .where('lower(sub.name) = :name', { name: name.toLowerCase() })
        .getOne();
      if (existingSub)
        return {
          ok: false,
          errors: [{ path: 'name', message: 'Name is already taken' }],
        };

      // save sub
      await sub.save();
      return { ok: true };
    } catch (err) {
      console.log(err);
      return {
        ok: false,
        errors: [{ path: 'unknown', message: 'Something went wrong' }],
      };
    }
  }
}
