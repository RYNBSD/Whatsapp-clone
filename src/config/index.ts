import { upload } from "./upload.js";
import app from "./app/index.js";
import swagger from "./swagger.js";
import * as db from "./db.js";
import * as options from "./options.js";

export const config = { app, db, swagger, upload, options } as const;
