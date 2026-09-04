import { Router } from "express";
import { createLinkHandler, deleteLinkHandler, getLinksHandler } from "../controllers/linkContoller.js";
import { authenticate } from "../middlewares/auth.js";
import { optionalAuthenticate } from "../middlewares/optionalAuth.js";
import { createLinkLimiter } from "../middlewares/rateLimiter.js";
import { getLinkStatsHandler } from "../controllers/linkStatsController.js";

const router = Router();
router.post('/',optionalAuthenticate,createLinkLimiter,createLinkHandler);
router.get('/',authenticate,getLinksHandler);
router.delete('/:id',authenticate,deleteLinkHandler);
router.get('/:id/stats',authenticate,getLinkStatsHandler);

export default router;
