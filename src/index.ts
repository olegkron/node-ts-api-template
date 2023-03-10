// // DEV config with local ENV variables
import "dotenv/config";
import { server } from "./server";
server();

// AWS config with remote ENV variables
// import { awsEnvConfig } from "./awsEnvConfig";
// awsEnvConfig();
