"use client";

import { useActionState } from "react";
import { EMPTY_ACTION_STATE } from "@/components/form/utils/to-action-state";
import Form from "@/components/form/form";
import { Input } from "@/components/ui/input";
import FieldError from "@/components/form/field-error";
import SubmitButton from "@/components/form/submit-button";
import { emailVerification } from "../actions/email-verification";

export default function EmailVerificationForm() {
  const [actionState, action] = useActionState(
    emailVerification,
    EMPTY_ACTION_STATE
  );

  return (
    <Form action={action} actionState={actionState}>
      <Input type="code" name="code" placeholder="Code" />
      <FieldError actionState={actionState} name="code" />

      <SubmitButton label="Verify Mail" />
    </Form>
  );
}
