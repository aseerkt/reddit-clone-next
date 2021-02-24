import 'reflect-metadata';
import 'colors';
import 'dotenv-safe/config';
import { createConnection } from 'typeorm';
import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import { buildSchema } from 'type-graphql';
import { PORT } from './constants';

const main = async () => {
  try {
    await createConnection();
    console.log('Connected to Database'.yellow.bold);
  } catch (err) {
    throw err;
  }

  const app = express();

  app.get('/', (_req, res) => res.send('Reddit Clone Backend API'));

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [__dirname + '/resolvers/**/*.{ts,js}'],
    }),
  });

  apolloServer.applyMiddleware({ app });

  app.listen(PORT, () => {
    console.log(
      `GraphQL Server is running on http://localhost:${PORT}${apolloServer.graphqlPath}`
        .blue.bold
    );
  });
};

main().catch((err) => console.log(err));
