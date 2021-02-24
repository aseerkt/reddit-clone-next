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
exports.AuthResolver = void 0;
const class_validator_1 = require("class-validator");
const type_graphql_1 = require("type-graphql");
const User_1 = require("../entities/User");
const extractErrors_1 = require("../utils/extractErrors");
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
    type_graphql_1.Field(() => , { nullable: true }),
    __metadata("design:type", Object)
], UserResponse.prototype, "errors", void 0);
UserResponse = __decorate([
    type_graphql_1.ObjectType()
], UserResponse);
let AuthResolver = class AuthResolver {
    register({ email, username, password }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let errors = {};
                const emailUser = yield User_1.User.findOne({ email });
                const usernameUser = yield User_1.User.findOne({ username });
                if (emailUser)
                    errors.email = 'Email is already taken';
                if (usernameUser)
                    errors.username = 'Username is already taken';
                const user = new User_1.User({ email, username, password });
                const validationErrors = yield class_validator_1.validate(user);
                if (validationErrors.length > 0) {
                    errors = Object.assign(Object.assign({}, errors), extractErrors_1.extractErrors(validationErrors));
                }
                if (Object.keys(errors).length > 0) {
                    return { errors };
                }
                yield user.save();
                return { user };
            }
            catch (err) {
                throw { errors: { unknown: 'Something went wrong' } };
            }
        });
    }
};
__decorate([
    type_graphql_1.Mutation(() => UserResponse),
    __param(0, type_graphql_1.Args()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [RegisterArgs]),
    __metadata("design:returntype", Promise)
], AuthResolver.prototype, "register", null);
AuthResolver = __decorate([
    type_graphql_1.Resolver()
], AuthResolver);
exports.AuthResolver = AuthResolver;
//# sourceMappingURL=AuthResolver.js.map