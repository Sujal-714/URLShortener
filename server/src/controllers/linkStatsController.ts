import type { Request, Response } from "express";
import type { AuthRequest } from "../middlewares/auth.js";
import { getLinkStats } from "../services/linkStatsService.js";
import { validate as isUUID } from "uuid";

export async function getLinkStatsHandler(req: Request, res: Response){

    const{id: linkId} = req.params;
    const userId = (req as AuthRequest).userId;

     if (!userId) {
         return res.status(401).json({
           error: "Unauthorized",
         });}
      if(typeof linkId !== "string"  || !isUUID(linkId)){
            return res.status(400).json({
                message:"Invalid Link",
            });
        }
    try {
        const stats = await getLinkStats(linkId,userId);
        return res.status(200).json({data: stats});
    } catch (error: any) {
        console.error('getLinkStatsHandler error:', error); 
        if (error?.message === 'LINK_NOT_FOUND') {
      return res.status(404).json({ error: 'Link not found' });
    }
    if (error?.message === 'FORBIDDEN') {
      return res.status(403).json({ error: 'You do not own this link' });
    }
    return res.status(500).json({ error: 'Server error' });
        
    }

}