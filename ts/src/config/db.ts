import { Sequelize } from "sequelize";

export async function connect() {
  const sequelize = new Sequelize();
  await sequelize.authenticate();
  global.sequelize = sequelize;
}

export async function close() {
  await global.sequelize?.close();
}

export async function sync() {
  await global.sequelize?.sync();
}
