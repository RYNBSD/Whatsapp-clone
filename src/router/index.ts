import { Router } from "express";
import { auth } from "./auth.js";

export const router = Router();

router.use("/auth", auth);
