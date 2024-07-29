import { Router } from "express";
import { util } from "../util/index.js";
import { controller } from "../controller/index.js";
import { config } from "../config/index.js";

export const user = Router();

const { upload } = config;
const { handleAsync } = util.fn;
const { search, profile, chats, messages, isContact, update, remove } = controller.user;

user.get("/search", handleAsync(search));

user.get("/chats", handleAsync(chats));

user.get("/messages", handleAsync(messages));

user.get("/is-contact", handleAsync(isContact))

user.get("/", handleAsync(profile));

user.put("/", handleAsync(upload.single("image")), handleAsync(update));

user.delete("/", handleAsync(remove));
