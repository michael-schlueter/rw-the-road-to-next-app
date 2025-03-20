"use client";

import { useActionState } from "react";
import { togglePermission } from "../actions/toggle-permission";
import { EMPTY_ACTION_STATE } from "@/components/form/utils/to-action-state";
import Form from "@/components/form/form";
import SubmitButton from "@/components/form/submit-button";
import { BanIcon, CheckIcon } from "lucide-react";

type PermissionToggleProps = {
  userId: string;
  organizationId: string;
  permissionKey: "canDeleteTickets";
  permissionValue: boolean;
};

export default function PermissionToggleDropdown({
  userId,
  organizationId,
  permissionKey,
  permissionValue,
}: PermissionToggleProps) {
  const [actionState, action] = useActionState(
    togglePermission.bind(null, {
      userId,
      organizationId,
      permissionKey,
    }),
    EMPTY_ACTION_STATE
  );
  return (
    <Form action={action} actionState={actionState}>
      <SubmitButton
        icon={permissionValue ? <CheckIcon /> : <BanIcon />}
        size="icon"
        variant={permissionValue ? "secondary" : "outline"}
      />
    </Form>
  );
}
