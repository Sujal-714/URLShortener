import type{ Request, Response } from "express";
import { resolveCode } from "../services/redirectService.js";
import crypto from 'crypto';
import { enqueueClickEvent } from "../queue/clickQueue.js";



export async function resolveCodeHandler(req: Request, res: Response){

    const code = req.params.code;
    if(typeof code !== 'string'){
    return res.status(400).json({ error: 'Invalid Code' })
    }
    let linkId: string, originalUrl: string;
    try{
    ({linkId ,originalUrl} = await resolveCode(code));
    } catch (error: any) {
     if (error?.message === 'LINK_NOT_FOUND') {
      return res.status(404).json({ error: 'Link not found or expired' });
    }
     return res.status(500).json({
      error: "Server error",
    });
}
    res.redirect(302,originalUrl);

    const ipHash = crypto.createHash("sha256").update(req.ip ?? "unknown").digest("hex");

    enqueueClickEvent({
        linkId,
        referrer: req.headers.referer ?? null,
        userAgent: req.headers["user-agent"] ?? null,
        ipHash,
    }).catch((error) => console.log("enqueueClickEvent error:", error));
   

}