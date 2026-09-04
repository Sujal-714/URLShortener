import { Queue } from "bullmq";
import { queueConnection } from "../config/queueConnection.js";



export interface ClickEventJob {
    linkId: string;
    referrer: string | null;
    userAgent: string | null;
    ipHash: string;
}

export const clickEventsQueue = new Queue<ClickEventJob>('click-events',{
    connection: queueConnection,
})

export async function enqueueClickEvent(data: ClickEventJob){
    try {
        await clickEventsQueue.add('click-recorded',data,{
            attempts:3,
            backoff:{type: 'exponential', delay: 1000},
            removeOnComplete: true,
            removeOnFail: false,
        })
    } catch (error) {
        console.log('Failed to enqueue click event (non-fatal):', error);
        
    }
}