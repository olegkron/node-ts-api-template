import { Request } from "express";
import { LeanDocument } from "mongoose";
import { UserType } from "../resources/user/model";

export interface Req extends Request {
  requester: LeanDocument<UserType>;
}
