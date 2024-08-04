// eslint-disable-next-line import/no-unresolved
import { BASE_URL } from "@env";
import * as SecureStore from "expo-secure-store";
import setCookieParser from "set-cookie-parser";
import { AUTHORIZATION } from "../constant";

export async function request(path: string, init?: RequestInit) {
  const oldToken = SecureStore.getItem(AUTHORIZATION) ?? "";

  const response = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      ...init?.headers,
      Authorization: `Bearer ${oldToken}`,
    },
    credentials: "include",
  });

  const setCookie = response.headers.get("set-cookie") ?? "";
  if (setCookie.length === 0) return response;

  const cookies = setCookieParser(setCookie);
  if (cookies.length === 0) return response;

  const newToken = cookies.find((cookie) => cookie.name === AUTHORIZATION);
  if (typeof newToken === "undefined" || newToken.value.length === 0)
    return response;

  SecureStore.setItem(AUTHORIZATION, newToken.value);
  return response;
}
