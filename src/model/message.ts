import type { Tables } from "../types/index.js";
import { DataTypes } from "sequelize";
import { User } from "./user.js";
import { ENUM } from "../constant/index.js";

export const Message = sequelize.define<Tables["Message"]>(
  "message",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    sender: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        key: "id",
        model: User,
      },
    },
    receiver: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        key: "id",
        model: User,
      },
    },
    message: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM(...ENUM.MESSAGE_TYPE),
      allowNull: false
    }
  },
  {
    timestamps: true,
    tableName: "Message",
  },
);
