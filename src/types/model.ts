import type { CreationOptional, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import type { schema } from "../schema/index.js";
import { z } from "zod";

type CreateOptionalId = { id: CreationOptional<number> };

type User = z.infer<typeof schema.model.User> & CreateOptionalId;

export type Tables = {
  User: Model<InferAttributes<User>, InferCreationAttributes<User>>;
};
