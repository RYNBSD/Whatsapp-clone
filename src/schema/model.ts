import { z } from "zod";

const Id = z.object({ id: z.number() });

export const User = z
  .object({
    username: z.string(),
    email: z.string().email(),
    phone: z.string(),
    password: z.string(),
  })
  .merge(Id);
