"use client";

import { useActionState } from "react";
import { createCustomerPortal } from "../actions/create-customer-portal";
import { EMPTY_ACTION_STATE } from "@/components/form/utils/to-action-state";
import Form from "@/components/form/form";
import { Button } from "@/components/ui/button";

type CustomerPortalFormProps = {
  organizationId: string | null | undefined;
  children: React.ReactNode;
};

export default function CustomerPortalForm({
  organizationId,
  children,
}: CustomerPortalFormProps) {
  const [actionState, action] = useActionState(
    createCustomerPortal.bind(null, organizationId),
    EMPTY_ACTION_STATE
  );
  return (
    <Form action={action} actionState={actionState}>
      <Button type="submit">{children}</Button>
    </Form>
  );
}
