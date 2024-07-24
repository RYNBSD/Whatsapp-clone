import { hashSync, genSaltSync, compareSync } from "bcrypt";

export const bcrypt = {
  hash: (str: string) => hashSync(str, genSaltSync(12)),
  compare: (str: string, hash: string) => compareSync(str, hash),
} as const;