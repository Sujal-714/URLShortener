import { fetchLinkStats } from "../repositories/queries/clickStatsQueries.js";
import { fetchLinksById } from "../repositories/queries/linkQueries.js";

export async function getLinkStats(linkId: string, userId: string){
    const link = await fetchLinksById(linkId);
     if(!link){
        throw new Error('LINK_NOT_FOUND');
     }
     if(link.user_id !== userId){
        throw new Error('FORBIDDEN');
     }

     return fetchLinkStats(linkId);
}