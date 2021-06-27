import DataLoader from 'dataloader';
import { getRepository } from 'typeorm';
import { User } from '../entities/User';

export const createUserLoader = () =>
  new DataLoader<string, User>(async (usernameArray) => {
    const users = await getRepository(User)
      .createQueryBuilder('u')
      .where('u.username IN (:...usernameArray)', {
        usernameArray: usernameArray as string[],
      })
      .getMany();
    console.log('all users', users);
    const usernameToUser: Record<string, User> = {};
    users.forEach((u) => {
      usernameToUser[u.username] = u;
    });

    return usernameArray.map((username) => usernameToUser[username]);
  });
