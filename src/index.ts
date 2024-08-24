import path from "node:path";
import process from "node:process";
import http from "node:http";
import url from "node:url";
import { Server as SocketServer } from "socket.io";
import { createAdapter } from "@socket.io/mongo-adapter";
import * as db from "./config/db.js";
import * as cache from "./config/cache.js";
import { BaseError } from "./error/index.js";
import { ENV, KEYS } from "./constant/index.js";

global.isProduction = process.env.NODE_ENV === "production";
global.__filename = url.fileURLToPath(import.meta.url);
global.__dirname = path.dirname(global.__filename);
global.__root = process.cwd();

if (!global.isProduction) await import("colors");

await db.connect();
const { default: app } = await import("./app.js");
await db.sync();

process.on("unhandledRejection", (error) => {
  throw error;
});

process.on("uncaughtException", async (error) => {
  await Promise.all([BaseError.handleError(error), db.close()]);
  process.exit(1);
});

const server = http.createServer(async (req, res) => app(req, res));
await cache.connect();

global.io = new SocketServer(server, {
  maxHttpBufferSize: 1e8,
  cors: { credentials: true, origin: (origin, callback) => callback(null, origin) },
});
global.io.adapter(createAdapter(global.mongo.db().collection(KEYS.CACHE.COLLECTION.SOCKET)));
await import("./socket/index.js");

server.listen(ENV.NODE.PORT, () => {
  if (global.isProduction) return;
  console.log(`Listening on port ${ENV.NODE.PORT}`.white.bgGreen);
});
