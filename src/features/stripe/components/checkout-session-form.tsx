"use client";

import Form from "@/components/form/form";
import { EMPTY_ACTION_STATE } from "@/components/form/utils/to-action-state";
import { Button } from "@/components/ui/button";
import { useActionState } from "react";
import { createCheckoutSession } from "../actions/create-checkout-session";
import clsx from "clsx";
import updateSubscription from "../actions/update-subscription";
import useConfirmDialog from "@/components/confirm-dialog";
import { LucideLoaderCircle } from "lucide-react";

type NewSubscriptionFormProps = {
  organizationId: string | null | undefined;
  priceId: string;
  children: React.ReactNode;
};

function NewSubscriptionForm({
  organizationId,
  priceId,
  children,
}: NewSubscriptionFormProps) {
  const [actionState, action] = useActionState(
    createCheckoutSession.bind(null, organizationId, priceId),
    EMPTY_ACTION_STATE
  );

  return (
    <Form action={action} actionState={actionState}>
      <Button type="submit" className="flex flex-col">
        <div>{children}</div>
      </Button>
    </Form>
  );
}

type UpdateSubscriptionButtonWithDialogProps = {
  organizationId: string | null | undefined;
  priceId: string;
  activePriceId: string;
  children: React.ReactNode;
};

function UpdateSubscriptionButtonWithDialog({
  organizationId,
  priceId,
  activePriceId,
  children,
}: UpdateSubscriptionButtonWithDialogProps) {
  const isActivePrice = activePriceId === priceId;

  const [dialogTrigger, dialog] = useConfirmDialog({
    title: "Confirm Subscription Update",
    description:
      "Are you sure you want to change your subscription plan? This may incur pro-rated charges or credits.",
    action: updateSubscription.bind(null, organizationId, priceId),
    trigger: (isDialogActionPending) => (
      <Button
        type="button"
        disabled={isActivePrice || isDialogActionPending}
        className={clsx("flex flex-col", {
          "h-16": true,
        })}
      >
        {isDialogActionPending ? (
          <LucideLoaderCircle className="mx-auto h-6 w-6 animate-spin" />
        ) : isActivePrice ? (
          <span>Current Plan</span>
        ) : (
          <span>Change Plan</span>
        )}
        <div>{children}</div>
      </Button>
    ),
  });

  return (
    <>
      {dialogTrigger}
      {dialog}
    </>
  );
}

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
  if (!activePriceId) {
    return (
      <NewSubscriptionForm organizationId={organizationId} priceId={priceId}>
        {children}
      </NewSubscriptionForm>
    );
  } else {
    return (
      <UpdateSubscriptionButtonWithDialog
        organizationId={organizationId}
        priceId={priceId}
        activePriceId={activePriceId}
      >
        {children}
      </UpdateSubscriptionButtonWithDialog>
    );
  }
}
