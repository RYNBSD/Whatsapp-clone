// eslint-disable-next-line import/no-unresolved
import { BASE_URL } from "@env";
import * as SecureStore from "expo-secure-store";
import setCookieParser from "set-cookie-parser";

export async function request(path: string, init?: RequestInit) {
  const authorization = "authorization";
  const oldToken = SecureStore.getItem(authorization) ?? "";

  const response = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      ...init?.headers,
      Authorization: `Bearer ${oldToken}`,
    },
    credentials: "include",
  });

  const cookies = setCookieParser(response.headers.get("set-cookie") ?? "");
  if (cookies.length === 0) return response;

  const newToken = cookies.find((cookie) => cookie.name === authorization);
  if (typeof newToken === "undefined" || newToken.value.length === 0)
    return response;

  SecureStore.setItem(authorization, newToken.value);
  return response;
}
