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

let hashedUserData: any[] = [];

userData.forEach(async (user) => {
  hashedUserData.push({ ...user, password: await argon2.hash('bob123') });
});

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
