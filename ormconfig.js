const dotenv = require('dotenv-safe');

dotenv.config();

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
  entities: ['dist/entities/**/*.js'],
  migrations: ['dist/migrations/**/*.js'],
  subscribers: ['dist/subscribers/**/*.js'],
  seeds: ['dist/seeds/**/*.js'],
  cli: {
    entitiesDir: 'src/entities',
    migrationsDir: 'src/migrations',
    subscribersDir: 'src/subscribers',
  },
};
