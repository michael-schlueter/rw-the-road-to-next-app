"use client";

import Form from "@/components/form/form";
import { EMPTY_ACTION_STATE } from "@/components/form/utils/to-action-state";
import { Button } from "@/components/ui/button";
import { useActionState } from "react";
import { createCheckoutSession } from "../actions/create-checkout-session";
import clsx from "clsx";
// import { createCustomerPortal } from "../actions/create-customer-portal";
import updateSubscription from "../actions/update-subscription";

type CheckoutSessionFormProps = {
  organizationId: string | null | undefined;
  priceId: string;
  activePriceId: string | null | undefined;
  children: React.ReactNode;
};

export default function CheckoutSessionForm({
  organizationId,
  priceId,
  activePriceId,
  children,
}: CheckoutSessionFormProps) {
  console.log(process.env.STRIPE_SECRET_KEY)
  const isActivePrice = activePriceId === priceId;
  
  

  const [actionState, action] = useActionState(
    !activePriceId
      ? createCheckoutSession.bind(null, organizationId, priceId)
      : updateSubscription.bind(null, organizationId, priceId),
    EMPTY_ACTION_STATE
  );

  return (
    <Form action={action} actionState={actionState}>
      <Button
        type="submit"
        disabled={isActivePrice}
        className={clsx("flex flex-col", {
          "h-16": !!activePriceId,
        })}
      >
        {!activePriceId ? null : isActivePrice ? (
          <span>Current Plan</span>
        ) : (
          <span>Change Plan</span>
        )}
        <div>{children}</div>
      </Button>
    </Form>
  );
}
