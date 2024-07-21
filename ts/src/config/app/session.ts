import RedisStore from "connect-redis";
import expressSession from "express-session";
import * as options from "../options.js";
import { cache } from "../cache.js";

const store = new RedisStore({
  client: cache,
});

export const session = expressSession({
  store,
  resave: false,
  saveUninitialized: false,
  secret: process.env.SESSION_SECRET,
  cookie: options.cookie,
});
