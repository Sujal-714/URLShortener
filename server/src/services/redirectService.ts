//cache-then-db logic

import { getCachedUrl, setCachedUrl } from "../cache/linkCache.js";
import { fetchLinkByCode } from "../repositories/queries/linkQueries.js";

interface ResolvedLink{
    linkId: string;
    originalUrl: string;
}
export async function resolveCode(code: string){
    const cached = await getCachedUrl(code);
    if (cached) return cached;

    const link = await fetchLinkByCode(code);
    if(!link){
        throw new Error('LINK_NOT_FOUND');
    }//Cache miss doesnt means data is not in db too!!

    const resolved: ResolvedLink = {linkId: link.id, originalUrl: link.original_url}
    await setCachedUrl(code,resolved);
    return resolved;

}