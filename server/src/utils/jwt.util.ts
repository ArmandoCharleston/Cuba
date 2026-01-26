import jwt from 'jsonwebtoken';
import { JWT_SECRET, config } from '../config/env';

export interface TokenPayload {
  id: number;
  email: string;
  rol: string;
}

export const generateToken = (payload: TokenPayload): string => {
  return jwt.sign(
    payload,
    JWT_SECRET,
    {
      expiresIn: config.jwt.expiresIn,
    } as jwt.SignOptions
  );
};

export const verifyToken = (token: string): TokenPayload => {
  return jwt.verify(token, JWT_SECRET) as TokenPayload;
};







