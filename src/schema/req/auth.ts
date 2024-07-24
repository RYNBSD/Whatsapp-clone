import { z } from "zod";


export default {
  SignUp: {
    Body: z.object({
      username: z.string().trim().min(1),
      email: z.string().trim().min(1).email(),
      phone: z.string().trim().min(1),
      password: z.string().trim().min(8)
    })
  },
  SignIn: {
    Body: z.object({
      email: z.string().trim().min(1).email(),
      password: z.string().trim().min(1)
    })
  }
} as const