import { Router } from "express";
import { util } from "../util/index.js";
import { middleware } from "../middleware/index.js";
import { config } from "../config/index.js";
import { controller } from "../controller/index.js";

export const auth = Router();

const { upload } = config;
const { handleAsync } = util.fn;
const { isUnauthenticated, isAuthenticated } = middleware.fn;
const { signUp, signIn, signOut, me, status } = controller.auth;

/**
 * @openapi
 *
 * /auth/sign-up:
 *  post:
 *    summary: Create a new account(user)
 *    tags:
 *      - auth
 *    requestBody:
 *      required: true
 *      content:
 *        multipart/form-data:
 *          schema:
 *            type: object
 *            properties:
 *              username:
 *                type: string
 *              phone:
 *                type: string
 *              email:
 *                type: string
 *                format: email
 *              image:
 *                type: string
 *                format: binary
 *              password:
 *                type: string
 *                format: password
 *            required:
 *              - username
 *              - phone
 *              - email
 *              - image
 *              - password
 *    responses:
 *      201:
 *        description: Created successfully
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
auth.post("/sign-up", handleAsync(isUnauthenticated), handleAsync(upload.single("image")), handleAsync(signUp));

/**
 * @openapi
 *
 * /auth/sign-in:
 *  post:
 *    summary: Sign in to an account
 *    tags:
 *      - auth
 *    requestBody:
 *      required: true
 *      content:
 *        multipart/form-data:
 *          schema:
 *            type: object
 *            properties:
 *              email:
 *                type: string
 *              password:
 *                type: string
 *            required:
 *              - email
 *              - password
 *    responses:
 *      200:
 *        description: Signed in successfully, set "authorization" cookie
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
auth.post("/sign-in", handleAsync(isUnauthenticated), handleAsync(upload.none()), handleAsync(signIn));

/**
 * @openapi
 *
 * /auth/sign-out:
 *  post:
 *    summary: Sign out from account
 *    tags:
 *      - auth
 *    responses:
 *      200:
 *        description: Signed out successfully
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
auth.post("/sign-out", handleAsync(isAuthenticated), handleAsync(upload.none()), handleAsync(signOut));

/**
 * @openapi
 *
 * /auth/me:
 *  post:
 *    summary: Authorization
 *    tags:
 *      - auth
 *    parameters:
 *      - in: header
 *        name: Authorization
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: Signed in successfully, set "authorization" cookie
 *        headers:
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
auth.post("/me", handleAsync(upload.none()), handleAsync(me));

// auth.post("/forgot-password", handleAsync(upload.none()), handleAsync(forgotPassword));

// auth.put("/reset-password", handleAsync(upload.none()), handleAsync(resetPassword));

/**
 * @openapi
 *
 * /auth/status:
 *  post:
 *    summary: Check status of user if he is still signed in or not
 *    tags:
 *      - auth
 *    responses:
 *      200:
 *        description: User still signed in
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                success:
 *                  type: boolean
 *                  default: true
 *      401:
 *        description: User is sign out
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
auth.get("/status", handleAsync(isAuthenticated), handleAsync(status));
