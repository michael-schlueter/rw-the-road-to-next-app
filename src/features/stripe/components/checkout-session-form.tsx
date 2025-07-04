"use client";

import Form from "@/components/form/form";
import { EMPTY_ACTION_STATE } from "@/components/form/utils/to-action-state";
import { Button } from "@/components/ui/button";
import { useActionState } from "react";
import { createCheckoutSession } from "../actions/create-checkout-session";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type CheckoutSessionFormProps = {
  organizationId: string | null | undefined;
  priceId: string;
  children: React.ReactNode;
};

export default function CheckoutSessionForm({
  organizationId,
  priceId,
  children,
}: CheckoutSessionFormProps) {
  const [actionState, action] = useActionState(
    createCheckoutSession.bind(null, organizationId, priceId),
    EMPTY_ACTION_STATE
  );

  return (
    <Form action={action} actionState={actionState}>
      <div>
        <Label htmlFor="promoCode" className="sr-only">Promo Code</Label>
        <Input
          id="promoCode"
          name="promoCode"
          type="text"
          placeholder="Enter optional promo code"
          className="mt-1"
        />
      </div>
      <Button type="submit" className="flex flex-col ">
        <div>{children}</div>
      </Button>
    </Form>
  );
}
