import type { Request } from "express";
import type { Socket } from "socket.io";

export async function onConnection(socket: Socket, index: number) {
  const req = socket.request as Request;

  socket.join(`${req.user!.dataValues.id}`);
}

export async function onDisconnect(socket: Socket) {
  console.log("user disconnected");
}
