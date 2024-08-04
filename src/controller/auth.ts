import type { NextFunction, Request, Response } from "express";
import type { ResponseLocals, ResponseSuccess, Tables } from "../types/index.js";
import { StatusCodes } from "http-status-codes";
import { serialize } from "cookie";
import { schema } from "../schema/index.js";
import { model } from "../model/index.js";
import { util } from "../util/index.js";
import { APIError } from "../error/index.js";
import { config } from "../config/index.js";
import { authenticate } from "../passport/fn.js";
import { ENUM } from "../constant/index.js";
import FileUploader from "../lib/upload.js";

const { SignUp, SignIn } = schema.req.auth;

export default {
  async signUp(req: Request, res: Response<ResponseSuccess, ResponseLocals>) {
    const image = req.file;
    if (typeof image === "undefined" || image.buffer.length === 0)
      throw APIError.controller(StatusCodes.BAD_REQUEST, "Profile image is required");

    const uploaded = await new FileUploader(image.buffer).upload();
    if (uploaded.length === 0) throw APIError.controller(StatusCodes.BAD_REQUEST, "Invalid image");

    const { Body } = SignUp;
    const { username, email, phone, password } = Body.parse(req.body);

    const { User } = model;

    const checkEmail = await User.findOne({
      attributes: ["email"],
      where: { email },
      limit: 1,
      plain: true,
      transaction: res.locals.transaction,
    });
    if (checkEmail !== null) throw APIError.controller(StatusCodes.CONFLICT, "Email already exists");

    const parsedPhone = phone.replaceAll(/\s/g, "");
    const checkPhone = await User.findOne({
      attributes: ["phone"],
      where: { phone: parsedPhone },
      limit: 1,
      plain: true,
      transaction: res.locals.transaction,
    });
    if (checkPhone !== null) throw APIError.controller(StatusCodes.CONFLICT, "Phone already exists");

    const { bcrypt } = util;
    const user = await User.create(
      { username, image: uploaded[0]!, email, phone: parsedPhone, password: bcrypt.hash(password) },
      { fields: ["username", "image", "email", "phone", "password"], transaction: res.locals.transaction },
    );

    res.status(StatusCodes.CREATED).json({
      success: true,
      data: {
        user: user.dataValues,
      },
    });
  },
  async signIn(req: Request, res: Response<ResponseSuccess, ResponseLocals>, next: NextFunction) {
    const { Body } = SignIn;
    const { email, password } = Body.parse(req.body);

    req.body.email = email;
    req.body.password = password;

    req.transaction = res.locals.transaction;

    const user = (await authenticate("local", req, res, next)) as Tables["User"];

    const { UserHistory } = model;
    await UserHistory.create(
      { ip: req.clientIp, type: ENUM.USER_HISTORY[0], userId: user.dataValues.id },
      { fields: ["ip", "type", "userId"], transaction: res.locals.transaction, returning: false },
    );

    const { jwt } = util;
    const { options } = config;

    res
      .status(StatusCodes.OK)
      .setHeader("Set-Cookie", serialize("authorization", jwt.sign({ email }), options.cookie))
      .json({
        success: true,
        data: {
          user: user.dataValues,
        },
      });
  },
  async signOut(req: Request, res: Response<ResponseSuccess, ResponseLocals>) {
    req.logOut((err) => {
      if (err) throw err;
      res
        .status(StatusCodes.OK)
        .clearCookie("connect.sid", { path: "/" })
        .json({ success: true });
    });
  },
  async me(req: Request, res: Response<ResponseSuccess, ResponseLocals>, next: NextFunction) {
    req.transaction = res.locals.transaction;

    const user = (await authenticate("bearer", req, res, next)) as Tables["User"];

    const { jwt } = util;
    const { options } = config;

    const { UserHistory } = model;
    await UserHistory.create(
      { ip: req.clientIp, type: ENUM.USER_HISTORY[0], userId: user.dataValues.id },
      { fields: ["ip", "type", "userId"], transaction: res.locals.transaction, returning: false },
    );

    res
      .status(StatusCodes.OK)
      .setHeader("Set-Cookie", serialize("authorization", jwt.sign({ email: user.dataValues.email }), options.cookie))
      .json({
        success: true,
        data: {
          user: user.dataValues,
        },
      });
  },
  async forgotPassword(req: Request, res: Response<ResponseSuccess, ResponseLocals>) {},
  async resetPassword(req: Request, res: Response<ResponseSuccess, ResponseLocals>) {},
  async status(_req: Request, res: Response<ResponseSuccess, ResponseLocals>) {
    res.status(StatusCodes.OK).json({ success: true });
  },
} as const;
