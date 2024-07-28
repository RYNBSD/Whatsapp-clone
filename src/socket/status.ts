import type { Request } from "express";
import type { Socket } from "socket.io";
import { model } from "../model/index.js";
import { ENUM, KEYS } from "../constant/index.js";

export async function onConnection(socket: Socket) {
  const req = socket.request as Request;
  const userId = req.user!.dataValues.id;

  console.log(`User connected ${userId},  Socket id ${socket.id}`);
  socket.join(req.session.id);

  await global.mongo
    .db()
    .collection(KEYS.CACHE.COLLECTION.SOCKET)
    .insertOne({ userId, socketId: socket.id }, { session: socket.locals.session });
  socket.broadcast.emit("user-status", { [userId]: true });
}

export async function onDisconnect(socket: Socket) {
  const req = socket.request as Request;
  const userId = req.user!.dataValues.id;
  const rooms = Array.from(socket.rooms).filter((room) => room !== socket.id);

  const { UserHistory } = model;

  await Promise.all([
    Promise.all(rooms.map((room) => socket.leave(room))),
    global.mongo
      .db()
      .collection(KEYS.CACHE.COLLECTION.SOCKET)
      .deleteOne({ userId, socketId: socket.id }, { session: socket.locals.session }),
    UserHistory.create(
      { ip: req.clientIp, type: ENUM.USER_HISTORY[1], userId: req.user!.dataValues.id },
      { fields: ["ip", "type", "userId"], transaction: socket.locals.transaction, returning: false },
    ),
  ]);

  socket.broadcast.emit("user-status", { [userId]: false });
}
