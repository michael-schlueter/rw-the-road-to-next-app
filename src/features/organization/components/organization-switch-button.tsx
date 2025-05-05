"use client";

import React, { useActionState } from "react";
import { switchOrganization } from "../actions/switch-organization";
import { EMPTY_ACTION_STATE } from "@/components/form/utils/to-action-state";
import Form from "@/components/form/form";
import { useQueryClient } from "@tanstack/react-query";
import { ACTIVE_ORGANIZATION_QUERY_KEY } from "../hooks/use-active-organization";

type OrganizationSwitchButtonProps = {
  organizationId: string;
  trigger: React.ReactElement;
};

export default function OrganizationSwitchButton({
  organizationId,
  trigger,
}: OrganizationSwitchButtonProps) {
  const queryClient = useQueryClient();

  const [actionState, action] = useActionState(async () => {
    const result = await switchOrganization(organizationId);

    if (result.status === "SUCCESS") {
      await queryClient.refetchQueries({
        queryKey: ACTIVE_ORGANIZATION_QUERY_KEY,
        exact: true,
      });
    }

    return result;
  }, EMPTY_ACTION_STATE);

  return (
    <Form action={action} actionState={actionState}>
      {trigger}
    </Form>
  );
}
