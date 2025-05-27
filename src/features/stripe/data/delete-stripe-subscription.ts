import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

export async function deleteStripeSubscription(
  subscription: Stripe.Subscription,
  eventAt: number,
) {
  await prisma.stripeCustomer.update({
    where: {
      customerId: subscription.customer as string,
    },
    data: {
      subscriptionId: null,
      subscriptionStatus: null,
      productId: null,
      priceId: null,
      eventAt,
    },
  });
}
