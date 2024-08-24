import type { Request } from "express";
import type { Socket } from "socket.io";
import { model } from "../model/index.js";
import { ENUM } from "../constant/index.js";
import { FileUploader } from "../lib/index.js";

export async function onMessage(
  socket: Socket,
  args: { to: number; message: Buffer; type: (typeof ENUM.MESSAGE_TYPE)[number] },
) {
  const req = socket.request as Request;

  const { Socket, Message } = model;
  const receiver = await Socket.findOne({
    where: { userId: args.to },
    limit: 1,
    plain: true,
    transaction: socket.locals.transaction,
  });

  let fileUri = "";
  if (args.type !== "text") {
    const uploaded = await new FileUploader(args.message).upload();
    if (uploaded.length === 0) return;
    fileUri = uploaded[0]!;
  }

  const message = await Message.create(
    {
      message: fileUri.length === 0 ? args.message.toString() : fileUri,
      sender: req.user!.dataValues.id,
      receiver: args.to,
      type: ENUM.MESSAGE_TYPE.includes(args.type) ? args.type : "text",
      seen: false,
    },
    { fields: ["message", "receiver", "sender", "type"], transaction: socket.locals.transaction },
  );
  socket.emit("message", message.dataValues);

  if (receiver === null) return;
  socket.to(receiver.dataValues.socketId).emit("message", message.dataValues);
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

  console.log(args);

  const req = socket.request as Request;
  socket.to(receiver.dataValues.socketId).emit("typing", { from: req.user!.dataValues.id, length: args.length });
}

export async function onSeen(socket: Socket, arg: { messageId: number }) {
  const { Socket, Message } = model;

  const message = await Message.findOne({
    where: { id: arg.messageId },
    limit: 1,
    plain: true,
    transaction: socket.locals.transaction,
  });
  if (message === null || message.dataValues.seen) return;

  await message.update(
    { seen: true },
    {
      fields: ["seen"],
      where: { id: arg.messageId },
      returning: true,
      transaction: socket.locals.transaction,
    },
  );

  const user = await Socket.findOne({
    where: { userId: message.dataValues.sender ?? 0 },
    limit: 1,
    plain: true,
    transaction: socket.locals.transaction,
  });

  socket.emit("seen", { messageId: arg.messageId });
  if (user !== null) socket.to(user.dataValues.socketId).emit("seen", { messageId: arg.messageId });
}
