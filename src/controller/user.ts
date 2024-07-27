import type { Request, Response } from "express";
import type { ResponseLocals, ResponseSuccess } from "../types/index.js";
import { Op } from "sequelize";
import Fuse from "fuse.js";
import { StatusCodes } from "http-status-codes";
import { schema } from "../schema/index.js";
import { model } from "../model/index.js";
import FileUploader from "../lib/upload.js";
import { APIError } from "../error/index.js";

const { Search, Update } = schema.req.user;

export default {
  async search(req: Request, res: Response<ResponseSuccess, ResponseLocals>) {
    const { Query } = Search;
    const { q } = Query.parse(req.query);

    const { User } = model;
    const users = await User.findAll({
      where: { username: { [Op.or]: q.split(/\s/g).map((key) => ({ [Op.like]: `%${key}%` })) } },
      limit: 25,
      transaction: res.locals.transaction,
    });

    const filteredUsers = new Fuse(
      users.map((user) => user.dataValues),
      {
        // The list of keys to search in the data
        keys: ["username"],
        // Should search queries be sorted
        shouldSort: true,
        // Search in a specific threshold
        threshold: 0.4,
        // Minimum number of characters before starting a search
        minMatchCharLength: 1,
        // Determine the number of search results returned
        includeScore: true,
        // Use extended search in the pattern (allows the use of wildcards)
        useExtendedSearch: true,
        // The location where the matched keys will be stored in each result item
        includeMatches: true,
        // Whether to ignore special characters
        ignoreLocation: true,
      },
    );

    res.status(users.length > 0 ? StatusCodes.OK : StatusCodes.NO_CONTENT).json({
      success: true,
      data: {
        users: filteredUsers.search(q).map((user) => user.item),
      },
    });
  },
  async profile(req: Request, res: Response<ResponseSuccess, ResponseLocals>) {
    res.status(StatusCodes.OK).json({
      success: true,
      data: {
        user: req.user!.dataValues,
      },
    });
  },
  async update(req: Request, res: Response<ResponseSuccess, ResponseLocals>) {
    let newImage = req.user!.dataValues.image;

    const image = req.file;
    if (typeof image !== "undefined" && image.buffer.length > 0) {
      const uploaded = await new FileUploader(image.buffer).upload();
      if (uploaded.length === 0) throw APIError.controller(StatusCodes.BAD_REQUEST, "Invalid image");
      await FileUploader.remove(req.user!.dataValues.image);
      newImage = uploaded[0]!;
    }

    const { Body } = Update;
    const { username } = Body.parse(req.body);
    req.user = await req.user!.update(
      { username, image: newImage },
      { fields: ["username", "image"], transaction: res.locals.transaction },
    );
    res.status(StatusCodes.OK).json({ success: true, data: { user: req.user!.dataValues } });
  },
  async remove(req: Request, res: Response<ResponseSuccess, ResponseLocals>) {
    await req.user!.destroy({ force: true });
    res.status(StatusCodes.OK).json({
      success: true,
    });
  },
} as const;
