import { DataTypes } from "sequelize";
import { Tables } from "../types/index.js";
import { ENUM } from "../constant/index.js";

export const User = sequelize.define<Tables["User"]>(
  "user",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { timestamps: true, tableName: "User" },
);

export const UserHistory = sequelize.define<Tables["UserHistory"]>(
  "user-history",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    ip: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    type: {
      type: DataTypes.ENUM(...ENUM.USER_HISTORY),
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        key: "id",
        model: User,
      },
    },
  },
  { createdAt: true, updatedAt: false, tableName: "UserHistory" },
);
