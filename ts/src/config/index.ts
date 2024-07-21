import { upload } from "./upload.js";
import * as db from "./db.js";
import * as options from "./options.js";
import app from "./app/index.js";
import { cache } from "./cache.js";

export const config = { app, db, cache, upload, options } as const;
