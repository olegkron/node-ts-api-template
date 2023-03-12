import { Request, Response } from "express";
import rateLimit from "express-rate-limit";
import Redis from "ioredis-mock";
import RedisStore from "rate-limit-redis";
import { config } from "../constants/config";

// Initialize Redis client
const redisClient = new Redis({
  host: config.redisHost,
  port: parseInt(config.redisPort),
});

redisClient.on("error", (err) => {
  console.error(`Error connecting to Redis: ${err.message}`);
});

redisClient.on("connect", () => {
  console.log(`Connected to Redis at ${config.redisHost}:${config.redisPort}`);
});

// Rate limiting middleware
export const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // limit each IP to 100 requests per windowMs
  keyGenerator: function (req: Request) {
    // use the user's IP address as the key
    return req.ip;
  },
  store: new RedisStore({
    client: redisClient,
    retryStrategy: (times) => {
      if (times <= 3) {
        return 200; // wait 200ms before trying again
      }
    },
  } as any),
  skip: function (req: Request) {
    // Skip rate limiting for requests coming from whitelisted IPs
    const whitelist = process.env.IP_WHITELIST?.split(",");
    return whitelist?.includes(req.ip);
  },
  onLimitReached: function (req: Request, res: Response, options: any) {
    // handle when a user exceeds the rate limit
    console.log(`Rate limit exceeded for IP ${req.ip}`);
    res.status(429).send("Too many requests, please try again later.");
  },
});
