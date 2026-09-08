import type { Request, Response, NextFunction } from "express";
import { httpDuration } from "../observability/metrics.js";

export function metricsMiddleware(req: Request, res: Response, next: NextFunction){

    const end = httpDuration.startTimer({method: req.method});
    res.on('finish',()=>{
        end({
            route: req.route?.path ?? req.path,
            status: res.statusCode
        });
    });
    next();

}