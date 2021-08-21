import 'dotenv/config';
import { createConnection, getConnection } from 'typeorm';
import { User } from '../entities/User';
import argon2 from 'argon2';
import userData from './userData.json';
import subData from './subData.json';
import postData from './postData.json';
import { makeId, slugify } from '../utils/postHelper';
import { Sub } from '../entities/Sub';
import { Post } from '../entities/Post';

console.log(process.env.argv);

const sluggedPostData = postData.map((p) => ({
  ...p,
  slug: slugify(p.title),
  identifier: makeId(),
}));

async function createFakeData() {
  await createConnection();
  const connection = getConnection();
  await connection.dropDatabase();
  await connection.synchronize();

  const hashedPassword = await argon2.hash(process.env.SEED_PASSWORD!);

  const hashedUserData = userData.map((u) => ({
    ...u,
    password: hashedPassword,
  }));

  await connection
    .createQueryBuilder()
    .insert()
    .into(User)
    .values(hashedUserData)
    .execute();

  // Create Subs

  await connection
    .createQueryBuilder()
    .insert()
    .into(Sub)
    .values(subData)
    .execute();

  // Create Posts

  await connection
    .createQueryBuilder()
    .insert()
    .into(Post)
    .values(sluggedPostData)
    .execute();
}

createFakeData().catch((err) => {
  console.log('Failed to run data seeding'.red);
  console.error(err);
});
