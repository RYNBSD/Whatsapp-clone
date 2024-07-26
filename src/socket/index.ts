import { StatusCodes } from "http-status-codes";
import requestIp from "request-ip";
import passport from "../passport/index.js";
import { config } from "../config/index.js";
import { APIError } from "../error/index.js";
import { util } from "../util/index.js";
import { onConnection, onDisconnect } from "./status.js";
import { onMessage, onTyping, onSeen } from "./message.js";

const { handleSocketHandshake, handleSocket } = util.fn;

global.io.engine.use(handleSocketHandshake(config.app.session));
global.io.engine.use(handleSocketHandshake(passport.session()));
global.io.engine.use(
  handleSocketHandshake((req, _res, next) => {
    if (req.isAuthenticated()) return next();
    return next(APIError.socket(StatusCodes.UNAUTHORIZED, "Unauthorized user"));
  }),
);
global.io.engine.use(handleSocketHandshake(requestIp.mw()));

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
