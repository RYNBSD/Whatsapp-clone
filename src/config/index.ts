import { upload } from "./upload.js";
import app from "./app/index.js";
import swagger from "./swagger.js";
import * as db from "./db.js";
import * as cache from "./cache.js";
import * as options from "./options.js";

export const config = { app, db, cache, swagger, upload, options } as const;
