"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserResolver = void 0;
const class_validator_1 = require("class-validator");
const type_graphql_1 = require("type-graphql");
const User_1 = require("../entities/User");
const types_1 = require("../types");
const cookieHandler_1 = require("../utils/cookieHandler");
const extractErrors_1 = require("../utils/extractErrors");
const tokenHandler_1 = require("../utils/tokenHandler");
const isUser_1 = require("../middlewares/isUser");
const isAuth_1 = require("../middlewares/isAuth");
const constants_1 = require("../constants");
let RegisterArgs = class RegisterArgs {
};
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], RegisterArgs.prototype, "email", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], RegisterArgs.prototype, "username", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], RegisterArgs.prototype, "password", void 0);
RegisterArgs = __decorate([
    type_graphql_1.ArgsType()
], RegisterArgs);
let UserResponse = class UserResponse {
};
__decorate([
    type_graphql_1.Field(() => User_1.User, { nullable: true }),
    __metadata("design:type", User_1.User)
], UserResponse.prototype, "user", void 0);
__decorate([
    type_graphql_1.Field(() => [types_1.FieldError], { nullable: true }),
    __metadata("design:type", Array)
], UserResponse.prototype, "errors", void 0);
UserResponse = __decorate([
    type_graphql_1.ObjectType()
], UserResponse);
let UserResolver = class UserResolver {
    hello() {
        return 'Hi';
    }
    me({ res }) {
        return res.locals.user;
    }
    register({ email, username, password }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let errors = [];
                const emailUser = yield User_1.User.findOne({ email });
                const usernameUser = yield User_1.User.findOne({ username });
                if (emailUser)
                    errors.push({ path: email, message: 'Email is already taken' });
                if (usernameUser)
                    errors.push({
                        path: username,
                        message: 'Username is already taken',
                    });
                if (errors.length > 0)
                    return { errors };
                const user = new User_1.User({ email, username, password });
                const validationErrors = yield class_validator_1.validate(user);
                if (validationErrors.length > 0) {
                    return { errors: extractErrors_1.extractErrors(validationErrors) };
                }
                yield user.save();
                return { user };
            }
            catch (err) {
                return { errors: [{ path: 'unknown', message: 'Something went wrong' }] };
            }
        });
    }
    login(usernameOrEmail, password, { res }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield User_1.User.findOne(usernameOrEmail.includes('@')
                    ? { email: usernameOrEmail }
                    : { username: usernameOrEmail });
                if (!user) {
                    console.log('No user');
                    return {
                        errors: [{ path: 'unknown', message: 'Incorrect Credentials' }],
                    };
                }
                const valid = yield user.verifyPassword(password);
                if (!valid) {
                    return {
                        errors: [{ path: 'unknown', message: 'Incorrect Credentials' }],
                    };
                }
                cookieHandler_1.setTokenToCookie(res, tokenHandler_1.createToken(user));
                return { user };
            }
            catch (err) {
                return { errors: [{ path: 'unknown', message: 'Something went wrong' }] };
            }
        });
    }
    logout({ res }) {
        return new Promise((resolve) => {
            res.clearCookie(constants_1.COOKIE_NAME, (err) => {
                if (err) {
                    console.log(err);
                    resolve(false);
                }
                res.locals.user = null;
                resolve(true);
            });
        });
    }
};
__decorate([
    type_graphql_1.Query(() => String),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], UserResolver.prototype, "hello", null);
__decorate([
    type_graphql_1.Query(() => User_1.User, { nullable: true }),
    type_graphql_1.UseMiddleware(isUser_1.isUser),
    __param(0, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UserResolver.prototype, "me", null);
__decorate([
    type_graphql_1.Mutation(() => UserResponse),
    __param(0, type_graphql_1.Args()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [RegisterArgs]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "register", null);
__decorate([
    type_graphql_1.Mutation(() => UserResponse),
    __param(0, type_graphql_1.Arg('usernameOrEmail')),
    __param(1, type_graphql_1.Arg('password')),
    __param(2, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "login", null);
__decorate([
    type_graphql_1.Mutation(() => Boolean),
    type_graphql_1.UseMiddleware(isAuth_1.isAuth),
    __param(0, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UserResolver.prototype, "logout", null);
UserResolver = __decorate([
    type_graphql_1.Resolver()
], UserResolver);
exports.UserResolver = UserResolver;
//# sourceMappingURL=UserResolver.js.map