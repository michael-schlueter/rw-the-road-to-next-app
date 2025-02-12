"use client";

import { useActionState } from "react";
import { EMPTY_ACTION_STATE } from "@/components/form/utils/to-action-state";
import Form from "@/components/form/form";
import SubmitButton from "@/components/form/submit-button";
import { emailVerificationResend } from "../actions/email-verification-resend";

export default function EmailVerificationResendForm() {
  const [actionState, action] = useActionState(
    emailVerificationResend,
    EMPTY_ACTION_STATE
  );

  return (
    <Form action={action} actionState={actionState}>
      <SubmitButton label="Resend Code" variant="ghost" />
    </Form>
  );
}
