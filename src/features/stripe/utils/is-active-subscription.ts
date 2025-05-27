import { StripeCustomer } from "@prisma/client";

export function isActiveSubscription(
  stripeCustomer: StripeCustomer | null | undefined
) {
  return (
    stripeCustomer?.subscriptionStatus === "active" ||
    stripeCustomer?.subscriptionStatus === "trialing"
  );
}
