import type { Request, Response } from "express";
import type { ResponseFailed } from "./src/types/index.js";
import express from "express";
import timeout from "connect-timeout";
import responseTime from "response-time";
import cors from "cors";
import compression from "compression";
import methodOverride from "method-override";
import morgan from "morgan";
import hpp from "hpp";
import cookieParser from "cookie-parser";
import requestIp from "request-ip";
import helmet from "helmet";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import cookieEncrypt from "cookie-encrypter";
import { config } from "./src/config/index.js";
import passport from "./src/passport/index.js";
import { StatusCodes } from "http-status-codes";
import { ENV, KEYS } from "./src/constant/index.js";
import { BaseError } from "./src/error/index.js";

const app = express();
app.set("env", ENV.NODE.ENV);
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

app.use(timeout(1000 * 60 * 5)); // 5 minutes
app.use(responseTime());
app.use(cors());
app.use(limiter);
app.use(compression({ level: 9 }));
app.use(methodOverride(KEYS.HTTP.HEADERS.METHOD_OVERRIDE)); // default: X-HTTP-Method-Override
app.use(morgan(global.isProduction ? "combined" : "dev"));
app.use(cookieParser(ENV.COOKIE.PARSER));
app.use(cookieEncrypt(ENV.COOKIE.ENCRYPT));
app.use(helmet());
app.use(hpp());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session);
app.use(passport.initialize());
app.use(passport.session());
app.use(requestIp.mw());

app.all("*", async (_req, res: Response<ResponseFailed>) => res.status(StatusCodes.NOT_FOUND).json({ success: false }));

app.use(async (error: unknown, _req: Request, res: Response<ResponseFailed>) => {
  await BaseError.handleError(error);
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: "Server error",
  });
});

export default app;
