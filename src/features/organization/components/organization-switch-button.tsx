"use client";

import React, { useActionState } from "react";
import { switchOrganization } from "../actions/switch-organization";
import { EMPTY_ACTION_STATE } from "@/components/form/utils/to-action-state";
import Form from "@/components/form/form";

type OrganizationSwitchButtonProps = {
  organizationId: string;
  trigger: React.ReactElement;
};

export default function OrganizationSwitchButton({
  organizationId,
  trigger,
}: OrganizationSwitchButtonProps) {
  const [actionState, action] = useActionState(
    switchOrganization.bind(null, organizationId),
    EMPTY_ACTION_STATE
  );
  return (
    <Form action={action} actionState={actionState}>
      {trigger}
    </Form>
  );
}
