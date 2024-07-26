import { Router } from "express";
import { util } from "../util/index.js";
import { controller } from "../controller/index.js";
import { config } from "../config/index.js";

export const user = Router();

const { upload } = config;
const { handleAsync } = util.fn;
const { search, profile, update, remove } = controller.user;

user.get("/search", handleAsync(search));

user.get("/", handleAsync(profile));

user.put("/", handleAsync(upload.none()), handleAsync(update));

user.delete("/", handleAsync(remove));
