import type { CreationOptional, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import { schema } from "../schema/index.js";
import { z } from "zod";

type Schema = typeof schema.model;

// type CreateOptionalId = { id: CreationOptional<number> };

// eslint-disable-next-line @typescript-eslint/ban-types
type OptionalId<Table, IdType> = "id" extends keyof Table ? { id: CreationOptional<IdType> } : {};

type ParsedTable<Table> = {
  [K in keyof Table]: Table[K] extends null | undefined ? CreationOptional<Table[K]> : Table[K];
} & OptionalId<Table, number>;

export type Tables = {
  [K in keyof Schema]: Model<
    InferAttributes<ParsedTable<z.infer<Schema[K]>>>,
    InferCreationAttributes<ParsedTable<z.infer<Schema[K]>>>
  >;
};
