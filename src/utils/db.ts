import mongoose, { ConnectOptions } from "mongoose";
import { config } from "../constants/config";

const connect = (url: string = config.dbUrl): Promise<typeof mongoose> => {
  return mongoose
    .connect(url, { useNewUrlParser: true, useUnifiedTopology: true } as ConnectOptions)
    .then(() => {
      console.log("Connected to database.");
      return mongoose;
    })
    .catch((err) => {
      console.error("Couldn't connect to database. " + err);
      process.exit(1);
    });
};
mongoose.set("strictQuery", false);

export default connect;
