import type { Request } from "express";
import type { Socket } from "socket.io";
import { model } from "../model/index.js";
import { ENUM } from "../constant/index.js";

export async function onMessage(
  socket: Socket,
  args: { to: number; message: string; type: (typeof ENUM.MESSAGE_TYPE)[number] },
) {
  const { Socket, Message } = model;
  const receiver = await Socket.findOne({
    where: { userId: args.to },
    limit: 1,
    plain: true,
    transaction: socket.locals.transaction,
  });
  if (receiver === null) return;

  const req = socket.request as Request;

  const message = await Message.create(
    {
      message: args.message,
      sender: req.user!.dataValues.id,
      receiver: args.to,
      type: ENUM.MESSAGE_TYPE.includes(args.type) ? args.type : "text",
    },
    { fields: ["message", "receiver", "sender", "type"], transaction: socket.locals.transaction },
  );

  socket.to(receiver.dataValues.socketId).to(socket.id).emit("message", message.dataValues);
}

export async function onTyping(socket: Socket, args: { to: number; length: number }) {
  const { Socket } = model;
  const receiver = await Socket.findOne({
    where: { userId: args.to },
    limit: 1,
    plain: true,
    transaction: socket.locals.transaction,
  });
  if (receiver === null) return;

  const req = socket.request as Request;
  socket.to(receiver.dataValues.socketId).emit("typing", { from: req.user!.dataValues.id, length: args.length });
}

export async function onSeen(socket: Socket) {}
