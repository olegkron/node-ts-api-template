import { NextFunction } from "express";
import apiError from "./apiError";
import apiErrorHandler from "./apiErrorHandler";
import { ifLoginExists, protect, signin, signup } from "./auth";
import connect from "./db";
import { log } from "./logger";
import { router } from "./router";
import { terminate } from "./terminate";
import { FormDataReq, Req } from "./types";
const use = (fn: any) => (req: Req, res: Response, next: NextFunction) => Promise.resolve(fn(req, res, next)).catch(next);

export { apiError, apiErrorHandler, protect, ifLoginExists, signin, signup, terminate, connect, router, Req, FormDataReq, use, log };
