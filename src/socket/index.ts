import { StatusCodes } from "http-status-codes";
import passport from "../passport/index.js";
import { config } from "../config/index.js";
import { APIError } from "../error/index.js";
import { onConnection, onDisconnect } from "./status.js";
import { util } from "../util/index.js";

const { handleSocketHandshake, handleSocket } = util.fn;

global.io.engine.use(handleSocketHandshake(config.app.session));
global.io.engine.use(handleSocketHandshake(passport.session()));
global.io.engine.use(
  handleSocketHandshake((req, _res, next) => {
    if (req.isAuthenticated()) return next();
    return next(APIError.socket(StatusCodes.UNAUTHORIZED, "Unauthorized user"));
  }),
);

global.io.on("connection", async (socket) => {
  handleSocket(onConnection)(socket);

  socket.on("join-room", async (...args: any[]) => {});

  socket.on("leave-room", async () => {});

  socket.on("disconnect", async (...args: any[]) => handleSocket(onDisconnect)(socket, args));
});

global.io.on("error", (error) => {
  console.error(error);
});
