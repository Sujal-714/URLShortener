import type { Request, Response } from "express";
import { register } from "../observability/metrics.js";

export async function metricsHandler(req: Request, res: Response){
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
}