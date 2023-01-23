import apiError from "./apiError";
import apiErrorHandler from "./apiErrorHandler";
import { ifLoginExists, protect, signin, signup } from "./auth";
import connect from "./db";
import { log } from "./logger";
import { router } from "./router";
import { terminate } from "./terminate";
const use = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

export { apiError, apiErrorHandler, protect, ifLoginExists, signin, signup, terminate, connect, router, use, log };
