import { Router } from "express";
import { util } from "../util/index.js";
import { middleware } from "../middleware/index.js";
import { config } from "../config/index.js";
import { controller } from "../controller/index.js";

export const auth = Router();

const { upload } = config;
const { handleAsync } = util.fn;
const { isUnauthenticated, isAuthenticated } = middleware.fn;
const { signUp, signIn, signOut, me, forgotPassword, resetPassword, status } = controller.auth;

auth.post("/sign-up", handleAsync(isUnauthenticated), handleAsync(upload.none()), handleAsync(signUp));

auth.post("/sign-in", handleAsync(isUnauthenticated), handleAsync(upload.none()), handleAsync(signIn));

auth.post("/sign-out", handleAsync(isAuthenticated), handleAsync(upload.none()), handleAsync(signOut));

auth.post("/me", handleAsync(upload.none()), handleAsync(me));

auth.post("/forgot-password", handleAsync(upload.none()), handleAsync(forgotPassword));

auth.put("/reset-password", handleAsync(upload.none()), handleAsync(resetPassword));

auth.get("/status", handleAsync(status));
