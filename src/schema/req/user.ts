import { z } from "zod";

export default {
  Search: {
    Query: z.object({
      q: z.string().trim().min(1),
    }),
  },
  Update: {
    Body: z.object({
      username: z.string().trim().min(1),
    }),
  },
} as const;
