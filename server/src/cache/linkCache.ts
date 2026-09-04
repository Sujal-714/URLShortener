import { redis } from "../config/redis.js";

interface CachedLink {
    linkId: string;
    originalUrl: string;
}
const TTL_SECONDS = 60 * 60; // 1 hour

export async function getCachedUrl(code: string){
    try {
        const raw = await redis.get(`links:${code}`);
        return raw ? JSON.parse(raw) : null ;
    } catch (error) {
        console.log('Cache read failed, falling back to DB:', error);
        return null;
    }
}


export async function setCachedUrl(code: string,data: CachedLink){
      try {
        return await redis.set(`links:${code}`,JSON.stringify(data),{EX: TTL_SECONDS});
    } catch (error) {
        console.log('Cache write failed (non-fatal)');
   
    }

}

export async function invalidateCachedUrl(code: string){
    try {
        return await redis.del(`links:${code}`);
    } catch (error) {
        console.log('Cache invalidation failed:', error);
        return null;
    }
}