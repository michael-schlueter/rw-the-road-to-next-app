import Stripe from "stripe";
import * as dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

const apiKey = process.env.STRIPE_SECRET_KEY;
if (!apiKey) {
  throw new Error("STRIPE_SECRET_KEY is not defined");
}

const stripe = new Stripe(apiKey, {
  typescript: true,
});

export { stripe };
