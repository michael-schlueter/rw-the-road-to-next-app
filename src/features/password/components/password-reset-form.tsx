"use client";

import { useActionState, useCallback, useState } from "react";
import { EMPTY_ACTION_STATE } from "@/components/form/utils/to-action-state";
import Form from "@/components/form/form";
import { Input } from "@/components/ui/input";
import FieldError from "@/components/form/field-error";
import SubmitButton from "@/components/form/submit-button";
import { passwordReset } from "../actions/password-reset";
import { PasswordStrengthResult } from "../utils/calculate-password-strength";
import { cn } from "@/lib/utils";
import PasswordStrengthMeter from "./password-strength-meter";

type PasswordResetFormProps = {
  tokenId: string;
};

const MIN_STRENGTH_SCORE = 3; // Minimum score required to enable submit

export default function PasswordResetForm({ tokenId }: PasswordResetFormProps) {
  const [actionState, action] = useActionState(
    passwordReset.bind(null, tokenId),
    EMPTY_ACTION_STATE
  );

  const [password, setPassword] = useState(
    (actionState.payload?.get("password") as string) || ""
  );

  // State to hold the strength received from the meter component
  const [currentStrength, setCurrentStrength] =
    useState<PasswordStrengthResult>(null);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  // Callback for the strength meter component
  const handleStrengthChange = useCallback(
    (strength: PasswordStrengthResult) => {
      setCurrentStrength(strength);
    },
    []
  );

  // Calculate disabled state based on the strength received from the meter
  const isSubmitDisabled =
    currentStrength === null || currentStrength.score < MIN_STRENGTH_SCORE;

  // Calculate visibility for the weak password message
  const showWeakPasswordMessage =
    isSubmitDisabled &&
    password && // only show if user typed something
    currentStrength !== null && // only show if strength calculated
    currentStrength.score < MIN_STRENGTH_SCORE; // only show if calculated strength is not sufficient

  return (
    <Form action={action} actionState={actionState}>
      <div>
        <Input
          type="password"
          name="password"
          placeholder="Password"
          value={password} // Controlled component
          onChange={handlePasswordChange}
          required
          aria-describedby="password-strength-feedback"
        />
        <PasswordStrengthMeter
          password={password}
          onStrengthChange={handleStrengthChange}
          className="mt-4"
        />
      </div>
      <FieldError actionState={actionState} name="password" />

      <Input
        type="password"
        name="confirmPassword"
        placeholder="Confirm Password"
        defaultValue={actionState.payload?.get("confirmPassword") as string}
      />
      <FieldError actionState={actionState} name="confirmPassword" />

      <SubmitButton label="Reset Password" disabled={isSubmitDisabled} />

      <div className="overflow-hidden">
        <p
          className={cn(
            "text-xs text-red-500 mt-1 transition-all duration-300 ease-in-out",
            showWeakPasswordMessage
              ? "opacity-100 max-h-4"
              : "opacity-0 max-h-0"
          )}
        >
          Password is too weak. Please choose a stronger one.
        </p>
      </div>
    </Form>
  );
}
