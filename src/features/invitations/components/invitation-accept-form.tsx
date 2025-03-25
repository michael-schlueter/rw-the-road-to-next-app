"use client";

import { useActionState } from "react";
import { acceptInvitation } from "../actions/accept-invitation";
import { EMPTY_ACTION_STATE } from "@/components/form/utils/to-action-state";
import Form from "@/components/form/form";
import SubmitButton from "@/components/form/submit-button";

export default function InvitationAcceptForm({ tokenId }: { tokenId: string }) {
  const [actionState, action] = useActionState(
    acceptInvitation.bind(null, tokenId),
    EMPTY_ACTION_STATE
  );

  return (
    <Form action={action} actionState={actionState}>
      <SubmitButton label="Accept" />
    </Form>
  );
}
