import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import * as stripeData from "@/features/stripe/data";

async function handleSubscriptionCreated(
  subscription: Stripe.Subscription,
  eventAt: number
) {
  await stripeData.updateStripeSubscription(subscription, eventAt);
}

async function handleSubscriptionUpdated(
  subscription: Stripe.Subscription,
  eventAt: number
) {
  await stripeData.updateStripeSubscription(subscription, eventAt);
}

async function handleSubscriptionDeleted(
  subscription: Stripe.Subscription,
  eventAt: number
) {
  await stripeData.deleteStripeSubscription(subscription, eventAt);
}

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get("Stripe-Signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return new NextResponse("Missing Webhook Secret", {
      status: 500,
    });
  }

  if (!signature) {
    return new NextResponse("Missing Stripe Signature", {
      status: 400,
    });
  }

  let event: Stripe.Event | null = null;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);

    switch (event.type) {
      case "customer.subscription.created":
        handleSubscriptionCreated(event.data.object, event.created);
        break;
      case "customer.subscription.updated":
        handleSubscriptionUpdated(event.data.object, event.created);
        break;
      case "customer.subscription.deleted":
        handleSubscriptionDeleted(event.data.object, event.created);
        break;
      case "customer.subscription.trial_will_end":
        console.log("Subscription trial will end. Send email?"); // TODO
        break;
      default:
        console.log(`Unhandled event type ${event.type}.`);
    }

    return new NextResponse(null, { status: 200 });
  } catch {
    return new NextResponse("Invalid Stripe Signature", {
      status: 400,
    });
  }
}
