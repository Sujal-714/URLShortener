import { nanoid } from "nanoid";
import { insertLink, removeLink , fetchLinks } from "../repositories/queries/linkQueries.js";
import { invalidateCachedUrl } from "../cache/linkCache.js";

const CODE_LENGTH = 7;
const MAX_RETRIES = 5;

export async function createLink({ originalUrl , userId = null}:{ originalUrl: string , userId : string | null })
{
for (let attempt = 0; attempt<MAX_RETRIES ; attempt++){
    const code = nanoid(CODE_LENGTH);
    
    try {
        return await insertLink({code,originalUrl,userId});
    } catch (err: any) {
        if(err.code === '23505') continue; // collision — retry
        throw err;
    }
}
throw new Error('Failed to generate a unique code after multiple attempts');
}
export async function getLinks(userId: string)
{
   return fetchLinks(userId);

}

export async function deleteLink({linkId,userId}: { linkId: string,userId: string })
{
    const link= await removeLink({linkId,userId});
     if(!link){
    throw new Error('LINK_NOT_FOUND');
   }    
   await invalidateCachedUrl(link.code);
  return link;
 
}


