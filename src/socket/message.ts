import type { Socket } from "socket.io";
import { KEYS } from "../constant/index.js";

export async function onMessage(socket: Socket, args: { receiver: number; message: string }) {
  console.log(args);

  socket.emit("message", "Hello world");

  // TODO: get socket id of the receiver
  // const receiver = await global.mongo
  //   .db()
  //   .collection(KEYS.CACHE.COLLECTION.SOCKET)
  //   .findOne({ userId: args.receiver }, { session: socket.locals.session });

  // if (receiver === null) return; // TODO: handle this error

  // socket.to(receiver.socketId).to(socket.id).emit("message", { message, sender: sender.userId });
}

export async function onTyping(socket: Socket) {}

export async function onSeen(socket: Socket) {}
