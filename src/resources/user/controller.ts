import { NextFunction, Request, Response } from "express";
import sharp from "sharp";
import { apiError } from "../../utils";
import { Req } from "../../utils/types";

import { LeanDocument } from "mongoose";
import { User, UserType } from "./model";

export interface FormDataReq extends Request {
  requester: LeanDocument<UserType>;
  body: {
    data: string;
    type: string;
  };
  file: any;
}

export const viewProfile = async (req: Req, res: Response, next: NextFunction) => {
  try {
    let { user_target } = req.body;
    if (!user_target) return next(apiError.badRequest("No target specified", "viewProfile"));
    const user = await User.findOne({ _id: user_target });
    if (!user) return next(apiError.notFound("User not found", "viewProfile"));
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(apiError.internal(error, "viewProfile"));
  }
};

export const imageUpload = async (req: FormDataReq, res: Response, next: NextFunction) => {
  try {
    req.body = JSON.parse(req.body.data);
    if (!req.body.type || !req.file) return next(apiError.badRequest("Either image or type not specified", "imageUpload"));
    if (req.body.type !== "event" && req.body.type !== "user" && req.body.type !== "group") return next(apiError.badRequest("Wrong image type", "imageUpload"));
    const path = `/uploads/${req.body.type}s/`;
    const name = `${req.requester._id}${new Date().getTime()}`;
    const extension = ".jpg";
    await sharp(req.file.buffer).resize(1920).jpeg({ quality: 50 }).toFile(`.${path}${name}${extension}`);

    return res.status(200).send({ success: true, imagePath: path + name + extension });
  } catch (error) {
    next(apiError.internal(error, "imageUpload"));
  }
};
