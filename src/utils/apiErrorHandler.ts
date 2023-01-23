import { Response } from "express";
import apiError from "./apiError";
import { log } from "./logger";
export interface ApiErrorErr {
  code?: number;
  message?: string;
  from?: string;
  params?: any;
}

function apiErrorHandler(err: ApiErrorErr, res: Response) {
  let from = err.from ? `[${err.from}]: ` : "";
  if (err instanceof apiError) {
    log.error(from + err.message);
    if (err.code === 500) res.status(500).json({ error: "Something went wrong." });
    else res.status(err.code).json({ error: err.message, ...err.params });
    return;
  }
  log.error(from + err);
  res.status(500).json({ error: "Something went horribly wrong." });
}

export default apiErrorHandler;
