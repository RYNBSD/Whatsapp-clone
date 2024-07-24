import { CookieOptions } from "express";

export const cookie = {
  sameSite: global.isProduction,
  httpOnly: global.isProduction,
  secure: global.isProduction,
  maxAge: 1000 * 60 * 60 * 24 * 30, // 1 month
  path: "/",
} satisfies CookieOptions;
