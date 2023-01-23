import dotenv from "dotenv";
import * as path from "path";

export const devEnvConfig = dotenv.config({ path: path.resolve(process.cwd(), "../.env") });
