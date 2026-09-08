import { Router } from "express";
import { metricsHandler } from "../controllers/metricsController.js";

const router = Router();
router.get('/',metricsHandler);
export default router;