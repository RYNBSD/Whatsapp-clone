import type { Request } from "express";
import { util } from "../util/index.js";
import { model } from "../model/index.js";
import { onConnection, onDisconnect } from "./status.js";
import { onMessage, onTyping, onSeen } from "./message.js";

const { handleSocket } = util.fn;

// global.io.engine.use(handleSocketHandshake(config.app.session));
// global.io.engine.use(handleSocketHandshake(passport.session()));
// global.io.engine.use(
//   handleSocketHandshake((req, _res, next) => {
//     if (req.isAuthenticated()) return next();
//     return next(APIError.socket(StatusCodes.UNAUTHORIZED, "Unauthorized user"));
//   }),
// );
// global.io.engine.use(handleSocketHandshake(requestIp.mw()));

global.io.use((socket, next) => {
  if (!socket.handshake.query) return next(new Error("Unauthorized"));

  const authorization = socket.handshake.query?.authorization ?? "";
  if (Array.isArray(authorization)) return next(new Error("Too many tokens"));
  else if (authorization.length === 0) return next(new Error("Empty token"));

  const token = authorization.split(" ")[1] ?? "";
  if (token.length === 0) return next(new Error("Empty token"));

  console.log(3);
  const { jwt } = util;
  const payload = jwt.verify(token) as { email?: string } | null;
  console.log(payload);

  if (payload === null) return next(new Error("Invalid token"));
  else if (typeof payload.email === "undefined" || payload.email.length === 0) return next(new Error("Bad token"));

  const { User } = model;
  User.findOne({ where: { email: payload.email }, limit: 1, plain: true })
    .then((user) => {
      if (user === null) return next(new Error("User not found"));
      (socket.request as Request).user = user;
      next();
    })
    .catch(next);
});

global.io.on("connection", async (socket) => {
  handleSocket(onConnection)(socket);

  socket.on("message", async (...args: any[]) => handleSocket(onMessage)(socket, ...args));

  socket.on("typing", async (...args: any[]) => handleSocket(onTyping)(socket, ...args));

  socket.on("seen", async (...args: any[]) => handleSocket(onSeen)(socket, ...args));

  socket.on("disconnect", async (...args: any[]) => handleSocket(onDisconnect)(socket, ...args));
});

global.io.on("error", (error) => {
  console.error(error);
});
