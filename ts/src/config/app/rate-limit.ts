import { rateLimit } from "express-rate-limit";
import { RedisStore } from "rate-limit-redis";
import { cache } from "../cache.js";

export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  store: new RedisStore({
    // @ts-expect-error - Known issue: the `call` function is not present in @types/ioredis
    sendCommand: (...args: string[]) => cache.call(...args),
  }),
});
