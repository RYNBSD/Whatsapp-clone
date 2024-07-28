import type { Request, Response } from "express";
import type { ResponseFailed, ResponseLocals } from "./types/index.js";
import path from "node:path";
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
import useragent from "express-useragent";
import helmet from "helmet";
import { StatusCodes } from "http-status-codes";
import { MulterError } from "multer";
import { ZodError } from "zod";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import cookieEncrypt from "cookie-encrypter";
import { config } from "./config/index.js";
import passport from "./passport/index.js";
import { ENV, KEYS } from "./constant/index.js";
import { BaseError } from "./error/index.js";
import { router } from "./router/index.js";
import { FileUploader } from "./lib/index.js";

const app = express();
app.set("env", ENV.NODE.ENV);
app.set("trust proxy", 1);
app.disable("x-powered-by");
app.enable("view cache");
app.enable("json escape");
app.enable("etag");

if (!global.isProduction) {
  const errorhandler = (await import("errorhandler")).default;
  app.use(errorhandler());
}

app.use(timeout(1000 * 60 * 5)); // 5 minutes
app.use(responseTime());
app.use(cors({ credentials: true }));
app.use(config.app.limiter);
app.use(compression({ level: 9 }));
app.use(methodOverride(KEYS.HTTP.HEADERS.METHOD_OVERRIDE)); // default: X-HTTP-Method-Override
app.use(morgan(global.isProduction ? "combined" : "dev"));
app.use(cookieParser(ENV.COOKIE.PARSER));
app.use(cookieEncrypt(ENV.COOKIE.ENCRYPT));
app.use(helmet());
app.use(hpp());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(config.app.session);
app.use(passport.initialize());
app.use(passport.session());
app.use(requestIp.mw());
app.use(useragent.express());

app.use("/", router);

const docs = config.swagger.init();
app.use("/docs", docs.serve, docs.ui);

app.use(express.static(path.join(__root, FileUploader.PUBLIC), { etag: true }));

app.all("*", async (_req, res: Response<ResponseFailed, ResponseLocals>) =>
  res.status(StatusCodes.NOT_FOUND).json({ success: false }),
);

app.use(async (error: Error, _req: Request, res: Response<ResponseFailed>) => {
  let status = StatusCodes.BAD_REQUEST;
  let message = "";

  if ((error instanceof BaseError || error.name === BaseError.name) && BaseError.checkOperational(error)) {
    status = (error as BaseError).statusCode;
    message = error.message;
  } else if (error instanceof MulterError || error.name === MulterError.name) {
    status = StatusCodes.FORBIDDEN;
    message = error.message;
  } else if (error instanceof ZodError || error.name === ZodError.name) {
    message = (error as ZodError).flatten().formErrors.join("\n");
  } else {
    status = StatusCodes.INTERNAL_SERVER_ERROR;
    message = "Server error";
    await BaseError.handleError(error);
  }
  res.status(status).json({
    success: false,
    message,
  });
});

export default app;
