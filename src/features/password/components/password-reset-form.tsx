"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
import { EMPTY_ACTION_STATE } from "@/components/form/utils/to-action-state";
import Form from "@/components/form/form";
import { Input } from "@/components/ui/input";
import FieldError from "@/components/form/field-error";
import SubmitButton from "@/components/form/submit-button";
import { passwordReset } from "../actions/password-reset";
import {
  calculatePasswordStrength,
  PasswordStrengthResult,
  strengthLevels,
} from "../utils/calculate-password-strength";
import { cn } from "@/lib/utils";

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
  const [strength, setStrength] = useState<PasswordStrengthResult>(null);
  const [, startTransition] = useTransition();

  useEffect(() => {
    // Use a transition to avoid blocking UI while calculating
    if (password) {
      startTransition(async () => {
        const result = await calculatePasswordStrength(password);
        setStrength(result);
      });
    } else {
      // Reset strength if password becomes empty
      setStrength(null);
    }
  }, [password]); // Re-run effect when password changes

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const isSubmitDisabled =
    strength === null || strength.score < MIN_STRENGTH_SCORE;

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
        {/* Strength Meter */}
        <div className="mt-4 space-y-2">
          <div className="h-2 w-full bg-gray-200 rounded overflow-hidden transition-opacity duration-300 ease-in-out">
            {strength !== null && (
              <div
                className={cn(
                  "h-full rounded transition-all duration-500 ease-out",
                  strengthLevels[strength.score].color,
                  strengthLevels[strength.score].width
                )}
              ></div>
            )}
          </div>
          {/* Strength Label and Feedback */}
          <div id="password-strength-feedback" className="h-4">
            <p className="text-xs text-muted-foreground transition-opacity duration-300 ease-in-out">
              {strength === null
                ? "Password strength"
                : `Strength: ${strength.label}`}
            </p>
          </div>
        </div>
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
      {isSubmitDisabled &&
        password &&
        strength &&
        strength.score < MIN_STRENGTH_SCORE && (
          <p className="text-xs text-red-500 mt-1">
            Password is too weak. Please choose a stronger one.
          </p>
        )}
    </Form>
  );
}
