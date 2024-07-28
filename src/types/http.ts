import type { Transaction } from "sequelize";

export type ResponseBody = Record<any, any> | Record<any, any>[];

export type ResponseLocals = {
  transaction: Transaction;
};

export type ResponseSuccess = {
  success: true;
  data?: ResponseBody;
};

export type ResponseFailed = {
  success: false;
  message?: string;
};
