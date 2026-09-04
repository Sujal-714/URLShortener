import { createClient } from "redis";
import { config } from "./config.js";
import { createNodeRedisClient } from "bullmq";


export const queueRawClient = createClient({
    url: config.redis_url
});

queueRawClient.on('error',(error)=>{
console.error('Queue Redis connection error:', error.message);
});

export const queueConnection = createNodeRedisClient(queueRawClient);

export async function connectQueueRedis(){
    if(!queueRawClient.isOpen){
    await queueRawClient.connect();
    }
} 