import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { LeanDocument } from "mongoose";
import { config } from "../constants/config";
import { User, UserType } from "../resources/user/model";
import apiError from "./apiError";

export interface Req extends Request {
  requester: LeanDocument<UserType>;
}

export const validateEmail = (email: string) => {
  let regex = /\S+@\S+\.\S+/;
  return regex.test(email);
};

export const validatePhone = (phone: string) => {
  let regex = /^[+]?\d{6,14}/;
  return regex.test(phone);
};
export const newToken = (user) => jwt.sign({ id: user._id }, config.secrets.jwt, { expiresIn: config.secrets.jwtExp });
export const verifyToken = (token) =>
  new Promise((resolve, reject) => {
    jwt.verify(token, config.secrets.jwt, (err, payload) => {
      if (err) return reject(err);
      resolve(payload);
    });
  });

export const signup = async (req: Req, res: Response, next: NextFunction) => {
  try {
    let { username, password, first_name, last_name } = req.body;
    if (!username || !password || !first_name || !last_name) {
      return next(apiError.badRequest("Not all required values were provided", "signup"));
    }
    const existingUser = await User.findOne({ username: [username] });
    if (existingUser) return next(apiError.badRequest("User already exists", "signup"));

    const user = await User.create({ username, password, first_name, last_name });
    const token = newToken(user);
    return res.status(201).send({ token, success: true });
  } catch (error) {
    return next(apiError.internal(error, "signup"));
  }
};
export const signin = async (req: Req, res: Response, next: NextFunction) => {
  try {
    let { username, password } = req.body;
    if (!username || !password) return next(apiError.badRequest("Username & Password must be provided", "signin"));

    const user = await User.findOne({ username: [username] })
      .select(`username password`)
      .exec();
    if (!user) return next(apiError.badRequest("Username & Password mismatch", "signin"));
    const match = await user.checkPassword(password);
    if (!match) return next(apiError.badRequest("Username & Password mismatch", "signin"));
    const token = newToken(user);
    const [userInfo] = await User.aggregate([{ $match: { _id: user._id } }]);
    if (userInfo.is_banned) return next(apiError.badRequest("We can't log you in at the moment.", "signin"));
    return res.status(201).send({ token, data: userInfo });
  } catch (error) {
    return next(apiError.internal(error, "signin"));
  }
};

export const protect = async (req: Req, res: Response, next: NextFunction) => {
  const bearer = req.headers.authorization;
  if (!bearer || !bearer.startsWith("Bearer ")) return res.status(401).end();
  const token = bearer.split("Bearer ")[1].trim();
  let payload;
  try {
    payload = await verifyToken(token);
  } catch (error) {
    console.error(`[protect] ${error}`);
    return res.status(401).end();
  }

  const user = await User.findById(payload.id).select("-password").lean().exec();
  if (!user) {
    return res.status(401).end();
  } else if (user.is_banned) {
    return next(apiError.badRequest("Access restricted", "protect"));
  }
  req.requester = user;
  next();
};

export const ifLoginExists = async (req: Req, res: Response, next: NextFunction) => {
  try {
    const { login, type } = req.body;
    if (!login || !type) return next(apiError.badRequest("Login & type must be provided", "ifLoginExists"));
    if (typeof login !== "string" || typeof type !== "string") return next(apiError.badRequest("Login & type must be a string", "ifLoginExists"));
    if (type !== "phone" && type !== "email") return next(apiError.badRequest("Type must be either phone or email", "ifLoginExists"));
    if (type === "phone" && !validatePhone(login)) return next(apiError.badRequest("Incorrect phone number format", "ifLoginExists"));
    if (type === "email" && !validateEmail(login)) return next(apiError.badRequest("Incorrect email format", "ifLoginExists"));

    const user = await User.findOne({ [type === "phone" ? "login_primary" : "login_secondary"]: [login] }).lean();
    if (user) {
      return res.status(200).send({ exists: true });
    } else {
      res.status(200).send({ exists: false });
    }
  } catch (error) {
    return next(apiError.internal(error, "ifLoginExists"));
  }
};
