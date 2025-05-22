import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRE_KEY, {
  typescript: true,
});

export { stripe };
