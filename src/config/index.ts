import { upload } from "./upload.js";
import * as db from "./db.js";
import * as options from "./options.js";
import app from "./app/index.js";

export const config = { app, db, upload, options } as const;
