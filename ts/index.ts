import path from "node:path";
import process from "node:process";
import http from "node:http";
import url from "node:url";
import * as db from "./src/config/db.js";
import { BaseError } from "./src/error/index.js";

global.isProduction = process.env.NODE_ENV === "production";
global.__filename = url.fileURLToPath(import.meta.url);
global.__dirname = path.dirname(global.__filename);
global.__root = process.cwd();

if (global.isProduction) await import("colors");

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

const server = http.createServer(app);

server.listen(process.env.PORT, () => {});
