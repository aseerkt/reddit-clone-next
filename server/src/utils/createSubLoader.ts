import DataLoader from 'dataloader';
import { getRepository } from 'typeorm';
import { Sub } from '../entities/Sub';

export const createSubLoader = () =>
  new DataLoader<string, Sub>(async (subNames) => {
    const subs = await getRepository(Sub)
      .createQueryBuilder('sub')
      .where('sub.name IN (:...subNames)', { subNames: subNames as string[] })
      .getMany();

    const subNamesToSubs: Record<string, Sub> = {};
    subs.forEach((sub) => (subNamesToSubs[sub.name] = sub));

    return subNames.map((subName) => subNamesToSubs[subName]);
  });
