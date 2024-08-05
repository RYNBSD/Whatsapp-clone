import { z } from "zod";
import { ENUM } from "../constant/index.js";

const Id = z.object({ id: z.number() });
const UserId = z.object({ userId: z.number() });

/**
 * @openapi
 *
 * components:
 *  schemas:
 *    User:
 *      type: object
 *      properties:
 *        id:
 *          type: integer
 *        username:
 *          type: string
 *        email:
 *          type: string
 *          format: email
 *        phone:
 *          type: string
 *        image:
 *          type: string
 *          format: binary
 *        password:
 *          type: string
 */
export const User = z
  .object({
    username: z.string(),
    image: z.string(),
    email: z.string().email(),
    phone: z.string(),
    password: z.string(),
  })
  .merge(Id);

/**
 * @openapi
 *
 * components:
 *  schemas:
 *    UserHistory:
 *      type: object
 *      properties:
 *        id:
 *          type: integer
 *        userId:
 *          type: integer
 *          description: User reference
 *        ip:
 *          type: string
 *        type:
 *          type: string
 *          enum: [connect, disconnect]
 */
export const UserHistory = z
  .object({
    ip: z.string().optional(),
    type: z.enum(ENUM.USER_HISTORY),
  })
  .merge(Id)
  .merge(UserId);

/**
 * @openapi
 * 
 * components:
 *   schemas:
 *     Message:
 *      type: object
 *      properties:
 *        id:
 *          type: integer
 *        sender:
 *          type: integer
 *          description: User reference
 *        receiver:
 *          type: integer
 *          description: User reference
 *        message:
 *          type: string
 *        type:
 *          type: string
 *          enum: [text, image, audio, video, file]
 *        seen:
 *          type: boolean
 */
export const Message = z
  .object({
    sender: z.number(),
    receiver: z.number(),
    message: z.string(),
    type: z.enum(ENUM.MESSAGE_TYPE),
    seen: z.boolean(),
  })
  .merge(Id);

/**
 * @openapi
 * 
 * components:
 *  schemas:
 *    Socket:
 *      type: object
 *      properties:
 *        userId:
 *          type: string
 *          description: User reference
 *        socketId:
 *          type: string
 *          description: Socket id of the user
 */
export const Socket = z
  .object({
    socketId: z.string(),
  })
  .merge(UserId);
