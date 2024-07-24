import type { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { APIError } from "../error/index.js";

export async function isAuthenticated(req: Request, _res: Response, next: NextFunction) {
  const isAuthenticated = req.isAuthenticated();
  if (isAuthenticated) return next();
  throw APIError.middleware(StatusCodes.UNAUTHORIZED, "Unauthenticated");
}

export async function isUnauthenticated(req: Request, _res: Response, next: NextFunction) {
  const isUnauthenticated = req.isUnauthenticated();
  if (isUnauthenticated) return next();
  throw APIError.middleware(StatusCodes.FORBIDDEN, "Already authenticated");
}
