module.exports = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'cl-reddit',
  synchronize: true,
  logging: true,
  entities: ['dist/entities/**/*.js'],
  migrations: ['dist/migrations/**/*.js'],
  subscribers: ['dist/subscribers/**/*.js'],
  cli: {
    entitiesDir: 'src/entities',
    migrationsDir: 'src/migrations',
    subscribersDir: 'src/subscribers',
  },
};
