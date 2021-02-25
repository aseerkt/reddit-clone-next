import 'reflect-metadata';
import 'colors';
import 'dotenv-safe/config';
import { createConnection } from 'typeorm';
import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import { buildSchema } from 'type-graphql';
import { PORT } from './constants';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const main = async () => {
  await createConnection();

  const app = express();

  app.use(
    cors({
      origin: 'http://localhost:3000',
      credentials: true,
    })
  );
  app.use(cookieParser());
  app.get('/', (_, res) => res.send('Reddit Clone Backend API'));

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [__dirname + '/resolvers/**/*.{ts,js}'],
    }),
    context: ({ req, res, connection }) => {
      const exceptions = ['password'];
      if (connection?.variables) {
        let newVariables: Record<string, any> = {};
        Object.entries(connection.variables).forEach(([key, value]) => {
          if (exceptions.includes(key) && typeof value === 'string') {
            newVariables[key] = value.trim();
          }
        });
        connection.variables = newVariables;
        console.log('connection variables', connection.variables);
      }
      return { req, res };
    },
  });

  apolloServer.applyMiddleware({ app, cors: false });

  app.listen(PORT, () => {
    console.log(
      `GraphQL API is running on http://localhost:${PORT}${apolloServer.graphqlPath}`
        .blue.bold
    );
  });
};

main().catch((err) => console.log(err));
