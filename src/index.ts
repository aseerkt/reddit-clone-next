// import path from 'path';
import 'reflect-metadata';
import 'colors';
import 'dotenv/config';
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
  app.use('/', express.static('public'));

  // if (process.env.NODE_ENV === 'production') {
  //   app.use(express.static('client/build'));

  //   app.get('*', (_req, res) => {
  //     res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  //   });
  // }

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
