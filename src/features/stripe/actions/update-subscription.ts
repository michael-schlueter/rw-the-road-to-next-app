"use server";

import {
  fromErrorToActionState,
  toActionState,
} from "@/components/form/utils/to-action-state";
import { getAdminOrRedirect } from "@/features/membership/queries/get-admin-or-redirect";
import { signInPath, subscriptionPath } from "@/paths";
import { redirect } from "next/navigation";
import { isActiveSubscription } from "../utils/is-active-subscription";
import { stripe } from "@/lib/stripe";
import { revalidatePath } from "next/cache";
import * as stripeData from "@/features/stripe/data";

export default async function updateSubscription(
  organizationId: string | null | undefined,
  priceId: string
) {
  if (!organizationId) {
    redirect(signInPath());
  }

  await getAdminOrRedirect(organizationId);

  const stripeCustomer =
    await stripeData.findStripeCustomerByOrganizationId(organizationId);

  if (!stripeCustomer) {
    return toActionState("ERROR", "Stripe customer not found");
  }

  const activeSubscription = isActiveSubscription(stripeCustomer);

  if (!activeSubscription) {
    return toActionState("ERROR", "No active subscription");
  }

  if (!stripeCustomer.subscriptionId) {
    return toActionState("ERROR", "Subscription ID not found for customer");
  }

  try {
    const currentSubscription = await stripe.subscriptions.retrieve(
      stripeCustomer.subscriptionId
    );

    if (!currentSubscription || currentSubscription.items.data.length === 0) {
      return toActionState(
        "ERROR",
        "Could not retrieve current subscription items"
      );
    }

    const subscriptionItemId = currentSubscription.items.data[0].id;

    await stripe.subscriptions.update(stripeCustomer.subscriptionId, {
      items: [
        {
          id: subscriptionItemId,
          price: priceId,
        },
      ],
      proration_behavior: "create_prorations",
    });
  } catch (error) {
    fromErrorToActionState(error);
  }
  revalidatePath(subscriptionPath(organizationId));
  return toActionState("SUCCESS", "Subscription updated successfully");
}
