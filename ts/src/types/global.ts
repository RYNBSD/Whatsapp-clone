/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable no-var */
import type { Sequelize } from "sequelize";

declare global {
  var sequelize: Sequelize;
  var isProduction: boolean;
  var __root: string;

  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: "production" | "development";
      PORT: `${number}`;

      SESSION_SECRET: string;

      COOKIE_PARSER: string;
      COOKIE_ENCRYPT: string;

      JWT_SECRET: string;
    }
  }
}

export {};
