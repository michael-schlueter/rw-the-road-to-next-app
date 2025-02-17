"use client";

import { useActionState } from "react";
import { EMPTY_ACTION_STATE } from "@/components/form/utils/to-action-state";
import Form from "@/components/form/form";
import FieldError from "@/components/form/field-error";
import SubmitButton from "@/components/form/submit-button";
import { emailVerification } from "../actions/email-verification";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_CHARS } from "input-otp";

export default function EmailVerificationForm() {
  const [actionState, action] = useActionState(
    emailVerification,
    EMPTY_ACTION_STATE
  );

  return (
    <Form action={action} actionState={actionState}>
      <InputOTP
        name="code"
        maxLength={8}
        pattern={REGEXP_ONLY_CHARS}
       >
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
            <InputOTPSlot index={6} />
            <InputOTPSlot index={7} />
          </InputOTPGroup>

      </InputOTP>
      <FieldError actionState={actionState} name="code" />

      <SubmitButton label="Verify Mail" />
    </Form>
  );
}
