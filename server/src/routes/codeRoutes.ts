import { Router } from "express";
import { resolveCodeHandler } from "../controllers/codeController.js";
import { redirectLimiter } from "../middlewares/rateLimiter.js";

const router = Router();

router.get('/:code',redirectLimiter,resolveCodeHandler);

export default router;
