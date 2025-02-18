"use client";

import { useActionState } from "react";
import { EMPTY_ACTION_STATE } from "@/components/form/utils/to-action-state";
import Form from "@/components/form/form";
import { Input } from "@/components/ui/input";
import FieldError from "@/components/form/field-error";
import SubmitButton from "@/components/form/submit-button";
import { emailReset } from "../actions/email-reset";

type EmailResetFormProps = {
  tokenId: string;
};

export default function EmailResetForm({ tokenId }: EmailResetFormProps) {
  const [actionState, action] = useActionState(
    emailReset.bind(null, tokenId),
    EMPTY_ACTION_STATE
  );

  return (
    <Form action={action} actionState={actionState}>
      <Input
        type="email"
        name="email"
        placeholder="Email Address"
        defaultValue={actionState.payload?.get("email") as string}
      />
      <FieldError actionState={actionState} name="email" />

      <SubmitButton label="Reset Email" />
    </Form>
  );
}
