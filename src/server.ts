import express from "express";
import * as http from "http";
import morgan from "morgan";
import { config } from "./constants/config";
import { apiError, apiErrorHandler, connect, protect, router, signin, signup, terminate } from "./utils";
// import { socket_io } from "./utils/socketio";
export const app = express();
const use = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
app.use(express.json());

app.use(morgan("dev"));
app.disable("etag");
app.use("/uploads", express.static("uploads"));

app.use("/api", protect, router);
app.post("/signup", use(signup));
app.post("/signin", use(signin));
app.use("/static", express.static("static"));
app.use(({ next }) => next(new apiError(404, "Not Found", "Server.ts")));
app.use(apiErrorHandler);

export const server = () => {
  try {
    connect();
    const httpServer = http.createServer(app);
    // socket_io(httpServer); // optionally attach socket.io
    httpServer.listen(config.port, () => console.log(`Server listening on ${config.baseURL}:${config.port}`));
    const exitHandler = terminate(httpServer, { coredump: false, timeout: 500 });
    process.on("uncaughtException", exitHandler(1, "Unexpected Error"));
    process.on("unhandledRejection", exitHandler(1, "Unhandled Promise"));
    process.on("SIGTERM", exitHandler(0, "SIGTERM"));
    process.on("SIGINT", exitHandler(0, "SIGINT"));
  } catch (e) {
    console.error("[server] ", e);
  }
};
