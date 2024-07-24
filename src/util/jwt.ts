import jsonwebtoken from "jsonwebtoken";
import { ENV } from "../constant/index.js";

export const jwt = {
  sign: (data: unknown, expiresIn = 1000 * 60 * 60 * 24 * 30) =>
    jsonwebtoken.sign({ data: JSON.stringify(data) }, ENV.JWT.SECRET, {
      expiresIn,
    }),
  verify(token: string) {
    let payload: unknown = null;

    try {
      payload = jsonwebtoken.verify(token, ENV.JWT.SECRET);

      if (payload === null) throw new Error();
      if (typeof payload !== "object") throw new Error();
      if (!("data" in payload)) throw new Error();
      if (typeof payload.data !== "string") throw new Error();

      payload = JSON.parse(payload.data);
    } catch (_) {
      payload = null;
    }

    return payload;
  },
} as const;
