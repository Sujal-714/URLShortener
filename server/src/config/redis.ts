import {createClient} from 'redis';
import { config } from './config.js';

export const redis = createClient({
    url: config.redis_url,
})

redis.on('error',(error)=>{
   console.log('Reddis connection error:', error.message);  
})

export async function connectRedis(){
    await redis.connect(); 
}