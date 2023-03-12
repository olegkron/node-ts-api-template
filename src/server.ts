import express, { NextFunction, Request, Response } from "express";

import helmet from "helmet";
import * as http from "http";
import pino from "pino-http";
import { config } from "./constants/config";
import { compressionMiddleware } from "./middleware/compression";
import { apiError, apiErrorHandler, connect, protect, router, signin, signup } from "./utils";
import { addProcessListeners } from "./utils/process";

export const app = express();

const use = (fn) => (req: Request, res: Response, next: NextFunction) => Promise.resolve(fn(req, res, next)).catch(next);
app.use(pino({ level: config.logLevel }));
app.use(helmet());
// app.use(limiter);
app.use(express.json());
app.disable("etag");
// app.use(morgan("dev"));
app.use(compressionMiddleware());

app.use("/uploads", express.static("uploads"));
app.use("/api", protect, router);
app.post("/signup", use(signup));
app.post("/signin", use(signin));
app.use("/static", express.static("static"));

app.use(({ next }) => next(new apiError(404, "Not found", "server")));
app.use(apiErrorHandler);

export const server = () => {
  try {
    connect();
    const httpServer = http.createServer(app);
    // socketIO(httpServer); // optionally attach socket.io
    httpServer.listen(config.port, () => console.log(`Server listening on port ${config.port}`));
    addProcessListeners(httpServer);
  } catch (error) {
    console.error("[server] ", error);
  }
};
