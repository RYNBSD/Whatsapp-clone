import path from "node:path";
import process from "node:process";
import http from "node:http";
import url from "node:url";
import { config } from "dotenv";
import * as db from "./src/config/db.js";

config();
global.isProduction = process.env.NODE_ENV === "production";
global.__filename = url.fileURLToPath(import.meta.url);
global.__dirname = path.dirname(global.__filename);
global.__root = process.cwd();

if (global.isProduction) await import("colors");

await db.connect();
const { app } = await import("./app.js");
await db.sync();

const server = http.createServer(app);

server.listen(process.env.PORT, () => {});
