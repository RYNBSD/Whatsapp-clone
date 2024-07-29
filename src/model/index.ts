import { Message } from "./message.js";
import { Socket } from "./socket.js";
import { User, UserHistory } from "./user.js";

export const model = { User, UserHistory, Message, Socket } as const;
