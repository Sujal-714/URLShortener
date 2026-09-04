import { Worker } from "bullmq";
import { connectQueueRedis, queueConnection } from "../config/queueConnection.js";
import type { ClickEventJob } from "../queue/clickQueue.js";
import { insertClickEvents } from "../repositories/queries/clickEventQueries.js";


async function start(){
await connectQueueRedis();

const worker = new Worker<ClickEventJob>('click-events',
    async(job) =>{
        await insertClickEvents(job.data);
    },
    {connection: queueConnection}
);

worker.on('completed',(job) => {
    console.log(`Click event processed: ${job.id}`);
});
worker.on('failed',(job, error) => {
    console.log(`Click event ${job?.id} failed`,error);
});



}
start();