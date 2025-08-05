"use server";

import { prisma } from "@/lib/prisma";
import Stripe from "stripe";
import { deprovisionOrganization } from "./deprovision-organization";

export async function deleteStripeSubscription(
  subscription: Stripe.Subscription,
  eventAt: number
) {
  const stripeCustomer = await prisma.stripeCustomer.update({
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

  // Make all private tickets for the organization public
  await prisma.ticket.updateMany({
    where: {
      organizationId: stripeCustomer.organizationId,
      private: true,
    },
    data: {
      private: false,
    },
  });

  await deprovisionOrganization(stripeCustomer.organizationId);
}
