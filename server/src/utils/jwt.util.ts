import jwt from 'jsonwebtoken';
import { config } from '../config/env';

export interface TokenPayload {
  id: number;
  email: string;
  rol: string;
}

export const generateToken = (payload: TokenPayload): string => {
  return jwt.sign(
    payload,
    config.jwt.secret,
    {
      expiresIn: config.jwt.expiresIn,
    } as jwt.SignOptions
  );
};

export const verifyToken = (token: string): TokenPayload => {
  const secret = config.jwt.secret;
  return jwt.verify(token, secret) as TokenPayload;
};







