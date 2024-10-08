// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { Socket } from "socket.io"
import type { Transaction } from "sequelize"

declare module "socket.io" {
  interface Socket {
    locals: {
      transaction: Transaction
    }
  }
}