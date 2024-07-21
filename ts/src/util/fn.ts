import type { Request, Response, NextFunction, RequestHandler } from "express";
import type { Transaction } from "sequelize";
import type { ResponseFailed } from "../types/index.js";
import { StatusCodes } from "http-status-codes";
import { BaseError } from "../error/index.js";
import { ZodError } from "zod";
import { MulterError } from "multer";

type HandleAsyncFn =
  | ((req: Request, res: Response<any, any>, next: NextFunction, transaction: Transaction) => Promise<void>)
  | RequestHandler;

export function handleAsync(fn: HandleAsyncFn) {
  return async (req: Request, res: Response<ResponseFailed>, next: NextFunction) => {
    try {
      const transaction = await sequelize.transaction();

      try {
        await fn(req, res, next, transaction);
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
