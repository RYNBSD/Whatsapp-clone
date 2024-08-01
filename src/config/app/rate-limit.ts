// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import MongoStore from "rate-limit-mongo"
import { rateLimit } from "express-rate-limit";
import { ENV } from "../../constant/index.js";

export const limiter = rateLimit({
  windowMs: 6000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  store: new MongoStore({
    uri: ENV.URI.MONGO,
  }),
});
