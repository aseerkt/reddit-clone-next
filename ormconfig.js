const dotenv = require('dotenv-safe');

dotenv.config();
const rootDir = process.env.NODE_ENV === 'production' ? 'src/' : 'dist/';

module.exports = {
  type: 'postgres',
  url: process.env.DATABASE_URL ?? process.env.DATABASE_URL,
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'cl-reddit',
  synchronize: false,
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
