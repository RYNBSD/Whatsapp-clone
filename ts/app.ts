import express from "express";
import timeout from "connect-timeout";
import responseTime from "response-time";
import cors from "cors";
import compression from "compression";
import methodOverride from "method-override";
import morgan from "morgan";
import hpp from "hpp";
import cookieParser from "cookie-parser";
import cookieEncrypt from "cookie-encrypter";
import { config } from "./src/config/index.js";
import helmet from "helmet";

export const app = express();
app.set("env", process.env.NODE_ENV);
app.set("trust proxy", 1);
app.disable("x-powered-by");
app.disable("view cache");
app.enable("json escape");
app.enable("etag");

if (!global.isProduction) {
  const errorhandler = (await import("errorhandler")).default;
  app.use(errorhandler);
}

const {
  app: { session, limiter },
} = config;

app.use(timeout(1000 * 60 * 5)); // 5minutes
app.use(responseTime());
app.use(cors());
app.use(limiter);
app.use(compression({ level: 9 }));
app.use(methodOverride()); // default: X-HTTP-Method-Override
app.use(morgan(global.isProduction ? "combined" : "dev"));
app.use(cookieParser(process.env.COOKIE_PARSER));
app.use(cookieEncrypt(process.env.COOKIE_ENCRYPT));
app.use(helmet());
app.use(hpp());
app.use(session);
