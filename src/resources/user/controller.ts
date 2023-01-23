import { NextFunction, Response } from "express";
import { apiError } from "../../utils";
import { Req } from "../../utils/auth";

import { User } from "./model";
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
