import { Router } from "express";
import { util } from "../util/index.js";
import { controller } from "../controller/index.js";
import { config } from "../config/index.js";

export const user = Router();

const { upload } = config;
const { handleAsync } = util.fn;
const { search, profile, chats, messages, update, remove } = controller.user;

/**
 * @openapi
 *
 * /user/search:
 *  get:
 *    summary: Search for users
 *    tags:
 *      - user
 *    parameters:
 *      - in: query
 *        name: q
 *        schema:
 *          type: string
 *        required: true
 *        description: Search query
 *    responses:
 *      200:
 *        description: Founded users
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                success:
 *                  type: boolean
 *                  default: true
 *                data:
 *                  type: object
 *                  properties:
 *                    users:
 *                      type: array
 *                      items:
 *                        $ref: '#/components/schemas/User'
 *      204:
 *        description: No users
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                success:
 *                  type: boolean
 *                  default: true
 *                data:
 *                  type: object
 *                  properties:
 *                    users:
 *                      type: array
 *      4xx:
 *        description: Client error
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                success:
 *                  type: boolean
 *                  default: false
 *                message:
 *                  type: string
 *                  default: ''
 *      5xx:
 *        description: Server error
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                success:
 *                  type: boolean
 *                  default: false
 *                message:
 *                  type: string
 *                  default: ''
 */
user.get("/search", handleAsync(search));

/**
 * @openapi
 *
 * /user/chats:
 *  get:
 *    summary: Get all chats (contacts)
 *    tags:
 *      - user
 *    responses:
 *      200:
 *        description: All chats
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                success:
 *                  type: boolean
 *                  default: true
 *                data:
 *                  type: object
 *                  properties:
 *                    chats:
 *                      type: array
 *                      items:
 *                        $ref: '#/components/schemas/User'
 *      204:
 *        description: No chat
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                success:
 *                  type: boolean
 *                  default: true
 *                data:
 *                  type: object
 *                  properties:
 *                    chats:
 *                      type: array
 *      4xx:
 *        description: Client error
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                success:
 *                  type: boolean
 *                  default: false
 *                message:
 *                  type: string
 *                  default: ''
 *      5xx:
 *        description: Server error
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                success:
 *                  type: boolean
 *                  default: false
 *                message:
 *                  type: string
 *                  default: ''
 */
user.get("/chats", handleAsync(chats));

/**
 * @openapi
 *
 * /user/messages:
 *  get:
 *    summary: Get message between two users
 *    tags:
 *      - user
 *    parameters:
 *      - in: query
 *        name: receiverId
 *        schema:
 *          type: string
 *        required: true
 *        description: define session between receiver and sender
 *      - in: query
 *        name: lastId
 *        schema:
 *          type: string
 *        required: false
 *        description: last message id (helps for pagination)
 *    responses:
 *      200:
 *        description: All messages
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                success:
 *                  type: boolean
 *                  default: true
 *                data:
 *                  type: object
 *                  properties:
 *                    messages:
 *                      type: array
 *                      items:
 *                        $ref: '#/components/schemas/Message'
 *      204:
 *        description: No message
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                success:
 *                  type: boolean
 *                  default: true
 *                data:
 *                  type: object
 *                  properties:
 *                    messages:
 *                      type: array
 *      4xx:
 *        description: Client error
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                success:
 *                  type: boolean
 *                  default: false
 *                message:
 *                  type: string
 *                  default: ''
 *      5xx:
 *        description: Server error
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                success:
 *                  type: boolean
 *                  default: false
 *                message:
 *                  type: string
 *                  default: ''
 */
user.get("/messages", handleAsync(messages));

/**
 * @openapi
 *
 * /user:
 *  get:
 *    summary: Get user profile
 *    tags:
 *      - user
 *    responses:
 *      200:
 *        description: User profile
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                success:
 *                  type: boolean
 *                  default: true
 *                data:
 *                  type: object
 *                  properties:
 *                    user:
 *                      $ref: '#/components/schemas/User'
 *      4xx:
 *        description: Client error
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                success:
 *                  type: boolean
 *                  default: false
 *                message:
 *                  type: string
 *                  default: ''
 *      5xx:
 *        description: Server error
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                success:
 *                  type: boolean
 *                  default: false
 *                message:
 *                  type: string
 *                  default: ''
 */
user.get("/", handleAsync(profile));

/**
 * @openapi
 *
 * /user:
 *  put:
 *    summary: Update user
 *    tags:
 *      - user
 *    requestBody:
 *      required: true
 *      content:
 *        multipart/form-data:
 *          schema:
 *            type: object
 *            properties:
 *              username:
 *                type: string
 *              image:
 *                type: string
 *                format: binary
 *            required:
 *              - username
 *    responses:
 *      200:
 *        description: User updated
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                success:
 *                  type: boolean
 *                  default: true
 *                data:
 *                  type: object
 *                  properties:
 *                    user:
 *                      $ref: '#/components/schemas/User'
 *      4xx:
 *        description: Client error
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                success:
 *                  type: boolean
 *                  default: false
 *                message:
 *                  type: string
 *                  default: ''
 *      5xx:
 *        description: Server error
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                success:
 *                  type: boolean
 *                  default: false
 *                message:
 *                  type: string
 *                  default: ''
 */
user.put("/", handleAsync(upload.single("image")), handleAsync(update));

/**
 * @openapi
 *
 * /user:
 *  delete:
 *    summary: Delete user
 *    tags:
 *      - user
 *    responses:
 *      200:
 *        description: User deleted
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                success:
 *                  type: boolean
 *                  default: true
 *      4xx:
 *        description: Client error
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                success:
 *                  type: boolean
 *                  default: false
 *                message:
 *                  type: string
 *                  default: ''
 *      5xx:
 *        description: Server error
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                success:
 *                  type: boolean
 *                  default: false
 *                message:
 *                  type: string
 *                  default: ''
 */
user.delete("/", handleAsync(remove));
