import type { Transaction } from "sequelize";
import { Tables } from "./model.js";

export type ResponseBody = Record<any, any> | Record<any, any>[];

export type ResponseLocals = {
  transaction: Transaction;
  user?: Tables["User"];
};

export type ResponseSuccess = {
  success: true;
  data?: ResponseBody;
};

export type ResponseFailed = {
  success: false;
  message?: string;
};
