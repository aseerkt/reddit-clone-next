require('dotenv').config();
const rootDir = 'dist/';
const __prod__ = process.env.NODE_ENV === 'production';

module.exports = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  ssl: __prod__
    ? {
        rejectUnauthorized: false,
      }
    : false,
  synchronize: __prod__,
  logging: true,
  entities: [rootDir + 'entities/**/*.js'],
  migrations: [rootDir + 'migrations/**/*.js'],
  subscribers: [rootDir + 'subscribers/**/*.js'],
  seeds: [rootDir + 'seeds/**/*.js'],
  cli: {
    entitiesDir: 'src/entities',
    migrationsDir: 'src/migrations',
    subscribersDir: 'src/subscribers',
  },
};
