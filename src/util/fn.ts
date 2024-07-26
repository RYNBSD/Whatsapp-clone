import type { Request, Response, NextFunction, RequestHandler } from "express";
import type { Socket } from "socket.io";
import type { ResponseFailed, ResponseLocals } from "../types/index.js";
import { StatusCodes } from "http-status-codes";
import { BaseError } from "../error/index.js";
import { ZodError } from "zod";
import { MulterError } from "multer";

type HandleAsyncFn = ((req: Request, res: Response<any, any>, next: NextFunction) => Promise<void>) | RequestHandler;

export function handleAsync(fn: HandleAsyncFn) {
  return async (req: Request, res: Response<ResponseFailed, ResponseLocals>, next: NextFunction) => {
    try {
      const transaction = await global.sequelize.transaction();
      res.locals.transaction = transaction;

      try {
        await fn(req, res, next);
        await transaction.commit();
      } catch (error) {
        await Promise.all([BaseError.handleError(error), transaction.rollback()]);

        let status: StatusCodes = StatusCodes.BAD_REQUEST;
        let message = "";

        if (error instanceof BaseError) {
          if (!BaseError.checkOperational(error)) return next(error);
          status = error.statusCode;
          message = error.message;
        } else if (error instanceof MulterError) {
          status = StatusCodes.FORBIDDEN;
          message = error.message;
        } else if (error instanceof ZodError) {
          message = error.flatten().formErrors.join("\n");
        } else {
          return next(error);
        }

        res.status(status).json({ success: false, message });
      }
    } catch (error) {
      return next(error);
    }
  };
}

type HandleSocketFn = (socket: Socket, ...args: any[]) => Promise<void>;

export function handleSocket(fn: HandleSocketFn) {
  return async (socket: Socket, ...args: any[]) => {
    try {
      const transaction = await global.sequelize.transaction();
      const session = global.mongo.startSession();

      session.startTransaction();
      socket.locals = { transaction, session };

      await fn(socket, ...args)
        .then(() => Promise.all([transaction.commit(), session.commitTransaction()]))
        .catch(() => Promise.all([transaction.rollback(), session.abortTransaction()]))
        .finally(() => session.endSession());
    } catch (error) {
      /* empty */
    }
  };
}

export function handleSocketHandshake(middleware: RequestHandler) {
  return (req: Request, res: Response, next: NextFunction) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const isHandshake = typeof req?._query?.sid === "undefined";
    if (isHandshake) {
      middleware(req, res, next);
    } else {
      next();
    }
  };
}
