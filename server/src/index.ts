import 'reflect-metadata';
import 'colors';
import dotenv from 'dotenv';
import { createConnection } from 'typeorm';
import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import { buildSchema } from 'type-graphql';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { graphqlUploadExpress } from 'graphql-upload';
import { PORT } from './constants';
import { createUserLoader } from './utils/createUserLoader';
import { createSubLoader } from './utils/createSubLoader';

dotenv.config();

const main = async () => {
  await createConnection();

  const app = express();

  app.use(
    cors({
      origin: process.env.CORS_ORIGIN,
      credentials: true,
    })
  );
  app.use(cookieParser());
  app.get('/', (_, res) => res.send('Reddit Clone Backend API'));

  app.use(
    '/graphql',
    graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [__dirname + '/resolvers/**/*.{ts,js}'],
    }),
    uploads: false,
    context: ({ req, res, connection }) => {
      // trimming variables
      const exceptions = ['password'];
      if (connection?.variables) {
        let newVariables: Record<string, any> = {};
        Object.entries(connection.variables).forEach(([key, value]) => {
          if (exceptions.includes(key) && typeof value === 'string') {
            newVariables[key] = value.trim();
          }
        });
        connection.variables = newVariables;
        // console.log('connection variables', connection.variables);
      }
      return {
        req,
        res,
        userLoader: createUserLoader(),
        subLoader: createSubLoader(),
      };
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
