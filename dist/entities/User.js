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
exports.User = void 0;
const class_validator_1 = require("class-validator");
const type_graphql_1 = require("type-graphql");
const argon2_1 = __importDefault(require("argon2"));
const typeorm_1 = require("typeorm");
const BaseColums_1 = require("./BaseColums");
const Post_1 = require("./Post");
let User = class User extends BaseColums_1.BaseColumns {
    constructor(user) {
        super();
        Object.assign(this, user);
    }
    hashPassword() {
        return __awaiter(this, void 0, void 0, function* () {
            this.password = yield argon2_1.default.hash(this.password);
        });
    }
    verifyPassword(password) {
        return argon2_1.default.verify(this.password, password);
    }
};
__decorate([
    type_graphql_1.Field(),
    class_validator_1.IsEmail(undefined, { message: 'Invalid email' }),
    class_validator_1.IsNotEmpty({ message: 'Email is required' }),
    typeorm_1.Column({ unique: true }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    type_graphql_1.Field(),
    typeorm_1.Index(),
    class_validator_1.IsAlphanumeric(undefined, { message: 'Username must be alphanumeric' }),
    class_validator_1.MinLength(3, {
        message: 'Username must be $constraint1 or more characters long',
    }),
    class_validator_1.IsNotEmpty({ message: 'Username is required' }),
    typeorm_1.Column({ unique: true }),
    __metadata("design:type", String)
], User.prototype, "username", void 0);
__decorate([
    class_validator_1.MinLength(6, {
        message: 'Password must be $constraint1 or more characters long',
    }),
    class_validator_1.IsNotEmpty({ message: 'Password is required' }),
    typeorm_1.Column(),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    typeorm_1.BeforeInsert(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], User.prototype, "hashPassword", null);
__decorate([
    typeorm_1.OneToMany(() => Post_1.Post, (post) => post.creator),
    __metadata("design:type", Array)
], User.prototype, "posts", void 0);
User = __decorate([
    type_graphql_1.ObjectType(),
    typeorm_1.Entity('users'),
    __metadata("design:paramtypes", [Object])
], User);
exports.User = User;
//# sourceMappingURL=User.js.map