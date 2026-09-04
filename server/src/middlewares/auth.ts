import type {Request, Response, NextFunction } from 'express'
import jwt, { type JwtPayload} from 'jsonwebtoken'
import { config } from '../config/config.js'

// Extend Express's Request type to include userId
export interface AuthRequest extends Request {
    userId?: string
}

export interface AuthPayload extends JwtPayload{
    userId: string
}

export const authenticate = (
req: AuthRequest,
res: Response,
next: NextFunction
)=>{
const token = req.cookies.token;

if (!token) {
  res.status(401).json({ error: 'No token provided' });
  return;
}

try {
    const decoded = jwt.verify(token, config.jwt_secret) as unknown as AuthPayload;
    req.userId = decoded.userId;
    next();
} catch (error) {
    res.status(401).json({error: 'Invalid or expired token'})
}

}