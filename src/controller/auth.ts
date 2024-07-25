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

const { SignUp, SignIn } = schema.req.auth;

export default {
  async signUp(req: Request, res: Response<ResponseSuccess, ResponseLocals>) {
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

    const checkPhone = await User.findOne({
      attributes: ["phone"],
      where: { phone },
      limit: 1,
      plain: true,
      transaction: res.locals.transaction,
    });
    if (checkPhone !== null) throw APIError.controller(StatusCodes.CONFLICT, "Phone already exists");

    const { bcrypt } = util;
    const user = await User.create(
      { username, email, phone: phone.replaceAll(/\s/g, ""), password: bcrypt.hash(password) },
      { fields: ["username", "email", "phone", "password"], transaction: res.locals.transaction },
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
      req.session.destroy((err) => {
        if (err) throw err;
        const { options } = config;
        io.in(req.session.id).disconnectSockets();
        res
          .status(StatusCodes.OK)
          .setHeader("Set-Cookie", serialize("authorization", "", options.cookie))
          .json({ success: true });
      });
    });
  },
  async me(req: Request, res: Response<ResponseSuccess, ResponseLocals>, next: NextFunction) {
    req.transaction = res.locals.transaction;

    const user = (await authenticate("bearer", req, res, next)) as Tables["User"];

    const { jwt } = util;
    const { options } = config;

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
  async status(req: Request, res: Response<ResponseSuccess, ResponseLocals>) {
    const isAuthenticated = req.isAuthenticated();
    res.sendStatus(isAuthenticated ? StatusCodes.OK : StatusCodes.UNAUTHORIZED);
  },
} as const;
