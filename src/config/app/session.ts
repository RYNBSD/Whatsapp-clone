import MongoStore from "connect-mongo";
import expressSession from "express-session";
import * as options from "../options.js";
import { ENV } from "../../constant/index.js";

const store = MongoStore.create({ mongoUrl: ENV.URI.MONGO });

export const session = expressSession({
  store,
  resave: false,
  saveUninitialized: false,
  secret: process.env.SESSION_SECRET,
  cookie: options.cookie,
  proxy: true,
});
