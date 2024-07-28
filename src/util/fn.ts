import type { Request, Response, NextFunction, RequestHandler } from "express";
import type { Socket } from "socket.io";
import type { ResponseFailed, ResponseLocals } from "../types/index.js";

type HandleAsyncFn = ((req: Request, res: Response<any, any>, next: NextFunction) => Promise<void>) | RequestHandler;

/**
 * Used for global middlewares, not endpoints middlewares
 */
export function handleAsyncMiddleware(fn: HandleAsyncFn) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      return next(error);
    }
  };
}

export function handleAsync(fn: HandleAsyncFn) {
  return async (req: Request, res: Response<ResponseFailed, ResponseLocals>, next: NextFunction) => {
    try {
      const transaction = await global.sequelize.transaction();
      res.locals.transaction = transaction;
      try {
        await fn(req, res, next);
        await transaction.commit();
      } catch (error) {
        await transaction.rollback();
        throw error;
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
  return (req: Request & { _query: Record<string, string> }, res: Response, next: NextFunction) => {
    const isHandshake = typeof req?._query?.sid === "undefined";
    if (isHandshake) {
      middleware(req, res, next);
    } else {
      next();
    }
  };
}
