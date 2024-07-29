import { z } from "zod";

export default {
  Search: {
    Query: z.object({
      q: z.string().trim().min(1),
    }),
  },
  Messages: {
    Query: z.object({
      receiverId: z.coerce.number(),
      lastId: z.coerce.number().optional(),
    }),
  },
  IsContact: {
    Query: z.object({
      contactId: z.coerce.number(),
    }),
  },
  Update: {
    Body: z.object({
      username: z.string().trim().min(1),
    }),
  },
} as const;
