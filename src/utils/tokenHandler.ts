import jwt from 'jsonwebtoken';
import { User } from '../entities/User';
const TOKEN_SECRET = process.env.JWT_SECRET!;

export const createToken = (user: User) => {
  return jwt.sign({ username: user.username }, TOKEN_SECRET, {
    expiresIn: '7d',
  });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, TOKEN_SECRET);
};
