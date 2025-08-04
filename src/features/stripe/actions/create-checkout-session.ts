"use server";

import {
  ActionState,
  fromErrorToActionState,
  toActionState,
} from "@/components/form/utils/to-action-state";
import { getAdminOrRedirect } from "@/features/membership/queries/get-admin-or-redirect";
import { stripe } from "@/lib/stripe";
import { pricingPath, signInPath, subscriptionPath } from "@/paths";
import { getBaseUrl } from "@/utils/url";
import { redirect } from "next/navigation";
import Stripe from "stripe";
import * as stripeData from "@/features/stripe/data";

export async function createCheckoutSession(
  organizationId: string | null | undefined,
  priceId: string,
  _actionState: ActionState,
  formData: FormData
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

  const price = await stripe.prices.retrieve(priceId);
  const promoCode = formData.get("promoCode") as string | null;

  const checkoutSessionParams: Stripe.Checkout.SessionCreateParams = {
    billing_address_collection: "auto",
    line_items: [
      {
        price: price.id,
        quantity: 1,
      },
    ],
    customer: stripeCustomer.customerId,
    mode: "subscription",
    success_url: `${getBaseUrl()}${subscriptionPath(organizationId)}`,
    cancel_url: `${getBaseUrl()}${pricingPath()}`,
    metadata: {
      organizationId,
    },
    subscription_data: {
      metadata: {
        organizationId,
      },
      trial_period_days: 7,
    },
  };

  if (promoCode && promoCode.trim() !== "") {
    // trim for removing accidental whitespaces (e.g. after copying promo code)
    const trimmedPromoCode = promoCode.trim();
    try {
      const promotionCodes = await stripe.promotionCodes.list({
        code: trimmedPromoCode,
        active: true,
        limit: 1,
        expand: ["data.coupon"],
      });

      if (promotionCodes.data.length === 0) {
        // No active promo code found for given code
        return toActionState(
          "ERROR",
          `Promotion code "${trimmedPromoCode}" is invalid, expired, or does not exist.`
        );
      }

      const firstPromoCode = promotionCodes.data[0];
      const coupon = firstPromoCode.coupon as Stripe.Coupon;

      if (!coupon || !coupon.valid) {
        return toActionState(
          "ERROR",
          `Promotion code "${trimmedPromoCode}" is invalid, expired, or does not exist.`
        );
      }

      checkoutSessionParams.discounts = [{ promotion_code: firstPromoCode.id }];
    } catch (error: unknown) {
      if (error instanceof Stripe.errors.StripeError) {
        if (
          error.type === "StripeInvalidRequestError" &&
          error.code === "resource_missing" &&
          error.param === "promotion_code"
        ) {
          return toActionState(
            "ERROR",
            `Promotion code "${trimmedPromoCode}" is invalid, expired, or does not exist.`
          );
        }
      }

      return fromErrorToActionState(error);
    }
  }

  const session = await stripe.checkout.sessions.create(checkoutSessionParams);

  if (!session.url) {
    return toActionState("ERROR", "Session URL could not be created");
  }

  redirect(session.url);
}
