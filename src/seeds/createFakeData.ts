import { Connection } from 'typeorm';
import { User } from '../entities/User';
import { Seeder } from 'typeorm-seeding';
import argon2 from 'argon2';
import userData from './userData.json';
import subData from './subData.json';
import postData from './postData.json';
import { makeId, slugify } from '../utils/postHelper';
import { Sub } from '../entities/Sub';
import { Post } from '../entities/Post';
import fs, { existsSync } from 'fs';
import path from 'path';

// function timePlus(duration = 0) {
//   const time = new Date('2020-11-07 07:01:43.18').getTime();

//   return new Date(time + duration).toISOString();
// }

let hashedUserData: any[] = [];

userData.forEach(async (user) => {
  hashedUserData.push({ ...user, password: await argon2.hash('bob123') });
});

const sluggedPostData = postData.map((p) => ({
  ...p,
  slug: slugify(p.title),
  identifier: makeId(),
}));

export default class CreateFakeData implements Seeder {
  public async run(_: any, connection: Connection): Promise<any> {
    await connection.dropDatabase();
    await connection.synchronize();

    const directory = 'public/images/';

    if (existsSync(directory)) {
      fs.readdir(directory, (err, files) => {
        if (err) throw err;

        for (const file of files) {
          fs.unlink(path.join(directory, file), (err) => {
            if (err) throw err;
          });
        }
      });
    }

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
}
