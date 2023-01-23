import { Router } from "express";
import * as user from "../resources/user/controller";
import { upload } from "./multer";
import { createPaymentIntent } from "./stripe";

export const router = Router();
const use = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

router.post("/view_user", use(user.viewProfile));
router.post("/create_payment_intent", use(createPaymentIntent));
router.post("/image_upload", upload.single("image"), use(user.imageUpload));
