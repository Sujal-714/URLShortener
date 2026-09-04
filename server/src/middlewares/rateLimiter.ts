import rateLimit,{ipKeyGenerator} from "express-rate-limit";
import type { AuthRequest } from "./auth.js";
import RedisStore from "rate-limit-redis";
import { redis } from "../config/redis.js";

//Strict: DB write 
export const createLinkLimiter = rateLimit({
windowMs: 60 * 1000,
standardHeaders: true,
legacyHeaders: false,

// Different limits for authenticated and not authenticated users.
limit: (req) => (req as AuthRequest).userId ? 30 : 10,

//Key by user ID if logged in, otherwise fall back to IP
keyGenerator: (req) => (req as AuthRequest).userId ?? ipKeyGenerator(req.ip ?? ""),

message: {error: 'Too many links created - Please slow down.'},
store: new RedisStore({
    sendCommand: (...args: string[]) => redis.sendCommand(args),
})
});

//Looser: DB Read 
export const redirectLimiter = rateLimit({
windowMs: 60 * 1000,
standardHeaders: true,
legacyHeaders: false,
limit: 100,
store: new RedisStore({
    sendCommand: (...args: string[]) => redis.sendCommand(args),
})
});