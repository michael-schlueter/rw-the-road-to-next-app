"use client";

import useConfirmDialog from "@/components/confirm-dialog";
import { useRouter } from "next/navigation";
import updateSubscription from "../actions/update-subscription";
import { Button } from "@/components/ui/button";
import clsx from "clsx";
import { LucideLoaderCircle } from "lucide-react";

type UpdateSubscriptionButton = {
  organizationId: string | null | undefined;
  priceId: string;
  activePriceId: string;
  children: React.ReactNode;
};

export default function UpdateSubscriptionButton({
  organizationId,
  priceId,
  activePriceId,
  children,
}: UpdateSubscriptionButton) {
  const isActivePrice = activePriceId === priceId;
  const router = useRouter();

  const [dialogTrigger, dialog] = useConfirmDialog({
    title: "Confirm Subscription Update",
    description:
      "Are you sure you want to change your subscription plan? This may incur pro-rated charges or credits.",
    action: updateSubscription.bind(null, organizationId, priceId),
    loadingMessage: "Updating subscription...",
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
    onSuccess: () => {
      router.refresh();
    }
  });

  return (
    <>
      {dialogTrigger}
      {dialog}
    </>
  );
}