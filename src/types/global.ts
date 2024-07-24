/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable no-var */
import type { Sequelize, Transaction } from "sequelize";
import { Tables } from "./model.js";

type RequestTransaction = { transaction?: Transaction }
type PassportUser = Tables["User"];

declare global {
  var sequelize: Sequelize;
  var isProduction: boolean;
  var __root: string;

  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: "production" | "development";
      PORT: `${number}`;

      POSTGRESQL_URI: string;

      SESSION_SECRET: string;

      COOKIE_PARSER: string;
      COOKIE_ENCRYPT: string;

      JWT_SECRET: string;
    }
  }

  namespace Express {
    interface Request extends RequestTransaction {}

    interface User extends PassportUser {}
  }
}

export {};
