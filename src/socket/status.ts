import type { Request } from "express";
import type { Socket } from "socket.io";
import { model } from "../model/index.js";
import { ENUM } from "../constant/index.js";
import { QueryTypes } from "sequelize";

export async function onConnection(socket: Socket) {
  const req = socket.request as Request;
  const userId = req.user!.dataValues.id;

  socket.join(req.session.id);

  const { Socket } = model;
  await Socket.destroy({ where: { userId }, force: true, transaction: socket.locals.transaction });
  await Socket.create(
    { userId, socketId: socket.id },
    { fields: ["userId", "socketId"], transaction: socket.locals.transaction, returning: false },
  );

  // Notify all users that new user has connected
  socket.broadcast.emit("contact-status", { userId, status: true });

  const contacts = await sequelize.query<{ receiver: number }>(
    `
    SELECT DISTINCT "M"."receiver" FROM "Socket" "S"
    INNER JOIN "Message" "M" ON "M"."receiver" = "S"."userId"
    WHERE "M"."sender" = 0
  `,
    {
      type: QueryTypes.SELECT,
      raw: true,
      transaction: socket.locals.transaction,
    },
  );

  // Notify the connected user of his connected contacts
  socket.emit(
    "connected-contacts",
    contacts.map((contact) => contact.receiver),
  );
}

export async function onDisconnect(socket: Socket) {
  const req = socket.request as Request;
  const userId = req.user!.dataValues.id;
  const rooms = Array.from(socket.rooms).filter((room) => room !== socket.id);

  const { UserHistory, Socket } = model;

  await Promise.all([
    Promise.all(rooms.map((room) => socket.leave(room))),
    Socket.destroy({ where: { userId, socketId: socket.id }, force: true, transaction: socket.locals.transaction }),
    UserHistory.create(
      { ip: req.clientIp, type: ENUM.USER_HISTORY[1], userId: req.user!.dataValues.id },
      { fields: ["ip", "type", "userId"], transaction: socket.locals.transaction, returning: false },
    ),
  ]);

  socket.broadcast.emit("contact-status", { userId, status: false });
}
