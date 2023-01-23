import mongoose, { ConnectOptions } from "mongoose";
import { config } from "../constants/config";
import { log } from "./logger";
const connect = (url = config.dbUrl) => {
  return mongoose
    .connect(url, { useNewUrlParser: true, useUnifiedTopology: true } as ConnectOptions)
    .then(() => {
      log.debug("db connected");
    })
    .catch((err) => {
      log.error("Couldn't connect to database. " + err);
      process.exit(1);
    });
};
export default connect;
