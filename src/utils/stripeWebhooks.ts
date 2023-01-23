import { NextFunction, Response } from "express";
import Stripe from "stripe";
import { User } from "../resources/user/model";
import { Req } from "../utils/types";
import apiError from "./apiError";
const SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const stripeApi = new Stripe(SECRET_KEY, { apiVersion: "2022-11-15" });
const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

export const stripeWebhooks = async (req: Req, res: Response, next: NextFunction) => {
  const sig = req.headers["stripe-signature"];
  let event;
  try {
    event = stripeApi.webhooks.constructEvent(req.body, sig, WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case "charge.succeeded": {
      if (!event.data.object.metadata._id) return next(apiError.badRequest("No _id in metadata", "stripeWebhooks"));
      await User.findOneAndUpdate({ _id: event.data.object.metadata._id }, { plan: "paid" }).lean();
      //   const email = event["data"]["object"]["receipt_email"]; // contains the email that will receive the receipt for the payment (users email usually)
      console.log(`PaymentIntent was successful for ${event.data.object.metadata}!`);
      break;
    }
    default:
      // Unexpected event type
      return res.status(400).end();
  }

  // Return a 200 response to acknowledge receipt of the event
  res.json({ received: true });
};
