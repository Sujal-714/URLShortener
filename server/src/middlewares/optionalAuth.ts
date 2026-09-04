import type {Request, Response, NextFunction } from 'express'
import type { AuthRequest, AuthPayload} from "./auth.js";
import jwt, { type JwtPayload} from 'jsonwebtoken'
import { config } from '../config/config.js'


export const optionalAuthenticate = (
req: AuthRequest,
res: Response,
next: NextFunction
)=>{
const token = req.cookies?.token;

if (!token) {
  return next(); // No token provided, proceed without authentication
}

try {
    const decoded = jwt.verify(token, config.jwt_secret) as unknown as AuthPayload;
    req.userId = decoded.userId;
    next();
} catch (error) {
    res.status(401).json({error: 'Invalid or expired token'})
}

}