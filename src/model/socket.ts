import type { Tables } from "../types/index.js";
import { DataTypes } from "sequelize";
import { User } from "./user.js";

export const Socket = sequelize.define<Tables["Socket"]>(
  "socket",
  {
    userId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: User,
        key: "id",
      },
    },
    socketId: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
  },
  { timestamps: false, tableName: "Socket" },
);

await Socket.sync({ force: true });
