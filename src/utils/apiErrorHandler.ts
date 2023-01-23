import apiError from "./apiError";
import { log } from "./logger";
function apiErrorHandler(err, req, res, next) {
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
