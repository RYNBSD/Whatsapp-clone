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
    ip: z.string().nullish(),
    type: z.enum(ENUM.USER_HISTORY),
  })
  .merge(Id)
  .merge(UserId);
