import { z } from "zod";
import { ENUM } from "../constant/index.js";

const Id = z.object({ id: z.number() });
const UserId = z.object({ userId: z.number() });

export const User = z
  .object({
    username: z.string(),
    image: z.string(),
    email: z.string().email(),
    phone: z.string(),
    password: z.string(),
  })
  .merge(Id);

export const UserHistory = z
  .object({
    ip: z.string().optional(),
    type: z.enum(ENUM.USER_HISTORY),
  })
  .merge(Id)
  .merge(UserId);

export const Message = z
  .object({
    sender: z.number(),
    receiver: z.number(),
    message: z.string(),
    type: z.enum(ENUM.MESSAGE_TYPE),
    seen: z.boolean(),
  })
  .merge(Id);

export const Socket = z
  .object({
    socketId: z.string(),
  })
  .merge(UserId);
