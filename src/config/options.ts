import { CookieOptions } from "express";

export const cookie = {
  sameSite: global.isProduction,
  httpOnly: global.isProduction,
  secure: global.isProduction,
  maxAge: 6000 * 15, // 15 minutes
  path: "/",
} satisfies CookieOptions;
