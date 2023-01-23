import { NextFunction, Response } from "express";
import Stripe from "stripe";
import { Req } from "../utils/types";
import apiError from "./apiError";
const PUBLISHABLE_KEY = process.env.STRIPE_PUBLIC_KEY;
const SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const stripeApi = new Stripe(SECRET_KEY, { apiVersion: "2022-11-15" });

export const planTypes = {
  week: 299,
  month: 699,
  year: 2799,
};
export const createPaymentIntent = async (req: Req, res: Response, next: NextFunction) => {
  try {
    //handle errors & check if tokenamount == price a user should pay
    // handle payment declined/cancelled front & backend
    if (!req.body.planType) return next(apiError.badRequest("planType not specified", "createPaymentIntent"));
    if (!planTypes[req.body.planType]) return next(apiError.badRequest("Invalid plan type", "createPaymentIntent"));
    let amount = planTypes[req.body.planType];
    const paymentIntent = await stripeApi.paymentIntents.create({
      amount,
      currency: "gbp",
      payment_method_types: ["card"],
      metadata: { _id: req.requester._id.toString(), planType: req.body.planType },
    });
    const clientSecret = paymentIntent.client_secret;
    res.json({ clientSecret: clientSecret });
  } catch (error) {
    // if (error.message) return next(apiError.badRequest(error.message, "createPaymentIntent"));
    return next(apiError.internal(error.message, "createPaymentIntent"));
  }
};
