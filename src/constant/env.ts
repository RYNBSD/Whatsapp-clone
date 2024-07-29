import { config } from "dotenv";
config();

export default {
  NODE: {
    PORT: process.env.PORT ?? 8000,
    ENV: process.env.NODE_ENV,
  },
  URI: {
    POSTGRES: global.isProduction
      ? process.env.POSTGRESQL_URI
      : "postgres://postgres:password@localhost:5432/whatsapp?replicaSet=rs0",
    MONGO: global.isProduction ? process.env.MONGODB_URI : "mongodb://localhost:27017/whatsapp",
  },
  COOKIE: {
    ENCRYPT: process.env.COOKIE_ENCRYPT,
    PARSER: process.env.COOKIE_PARSER,
  },
  JWT: {
    SECRET: process.env.JWT_SECRET,
  },
  SESSION: {
    SECRET: process.env.SESSION_SECRET,
  },
  // MAIL: {
  //   USER: process.env.MAIL_USER,
  //   PASS: process.env.MAIL_PASS,
  // },
} as const;
