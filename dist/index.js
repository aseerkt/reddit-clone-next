"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
require("colors");
require("dotenv-safe/config");
const typeorm_1 = require("typeorm");
const apollo_server_express_1 = require("apollo-server-express");
const express_1 = __importDefault(require("express"));
const type_graphql_1 = require("type-graphql");
const constants_1 = require("./constants");
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    yield typeorm_1.createConnection();
    const app = express_1.default();
    app.use(cors_1.default({
        origin: 'http://localhost:3000',
        credentials: true,
    }));
    app.use(cookie_parser_1.default());
    app.get('/', (_, res) => res.send('Reddit Clone Backend API'));
    const apolloServer = new apollo_server_express_1.ApolloServer({
        schema: yield type_graphql_1.buildSchema({
            resolvers: [__dirname + '/resolvers/**/*.{ts,js}'],
        }),
        context: ({ req, res, connection }) => {
            const exceptions = ['password'];
            if (connection === null || connection === void 0 ? void 0 : connection.variables) {
                let newVariables = {};
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
    app.listen(constants_1.PORT, () => {
        console.log(`GraphQL API is running on http://localhost:${constants_1.PORT}${apolloServer.graphqlPath}`
            .blue.bold);
    });
});
main().catch((err) => console.log(err));
//# sourceMappingURL=index.js.map