// require('dotenv').config();
const rootDir = 'dist/';

module.exports = {
  type: process.env.DB_DIALECT,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
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
