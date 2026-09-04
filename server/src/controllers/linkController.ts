import { type Request, type Response } from "express";
import { isValidUrl } from "../utils/isValidUrl.js";
import { createLink, deleteLink, getLinks } from "../services/linkService.js";
import { validate as isUUID } from "uuid";
import type { AuthRequest } from "../middlewares/auth.js";

export const createLinkHandler = async (req: AuthRequest, res: Response) => {
try {
    const { originalUrl} = req.body;

    if(!originalUrl || !isValidUrl(originalUrl)  ){
     return res.status(400).json({error:'A valid URL is required'});
    }

    const userId =  req.userId || null;
    const link = await createLink({originalUrl, userId});

    return res.status(201).json({
        shortUrl:`${link.code}`,
        ...link,
    })
} catch (error) {
   console.error(error);

  res.status(500).json({
    error: "Server error",
  });
    
}
}

export const deleteLinkHandler = async (req: AuthRequest, res: Response) => {
    try {
        const {id: linkId} = req.params;
        const userId = req.userId;
           if (!userId) {
         return res.status(401).json({
           error: "Unauthorized",
         });
       }
        if(typeof linkId !== "string"  || !isUUID(linkId)){
            return res.status(400).json({
                message:"Invalid Link",
            });
        }
        const result= await deleteLink({linkId,userId});

        return res.status(200).json(
            {message:"Sucessful deletion",
            data:result,
        });
    } catch (error: any ) {
         if (error?.message === 'LINK_NOT_FOUND') {
    return res.status(404).json({
      message: 'Link not found',
    });
  }

  res.status(500).json({
    error: "Server error",
  });
    
    }
}
export const getLinksHandler = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.userId;

        
        if ( !userId) {
         return res.status(401).json({ error: 'Unauthorized' })
        }

        const result= await getLinks(userId);

        return res.status(200).json(
            {message:"Sucessfully fetched links",
            data:result,
        });
    } catch (error: any ) {
          console.error(error);
 

  res.status(500).json({
    error: "Server error",
  });
    
    }
}