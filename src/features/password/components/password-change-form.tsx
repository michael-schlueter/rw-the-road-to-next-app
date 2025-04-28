"use client";

import { useActionState, useEffect, useState } from "react";
import { EMPTY_ACTION_STATE } from "@/components/form/utils/to-action-state";
import Form from "@/components/form/form";
import { Input } from "@/components/ui/input";
import FieldError from "@/components/form/field-error";
import SubmitButton from "@/components/form/submit-button";
import { passwordChange } from "../actions/password-change";
import { useDebouncedCallback } from "use-debounce";

export default function PasswordChangeForm() {
  const [actionState, action] = useActionState(
    passwordChange,
    EMPTY_ACTION_STATE
  );
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  const checkPasswordsMatch = useDebouncedCallback(() => {
    setPasswordsMatch(
      newPassword === confirmPassword || confirmPassword === ""
    );
  }, 500);

  // Effect to check password match whenever newPassword or confirmPasswrd changes
  useEffect(() => {
    checkPasswordsMatch();

    // Cleanup function to cancel the debounced call if component unmounts or dependencies change before timeout
    return () => {
      checkPasswordsMatch.cancel();
    };
  }, [newPassword, confirmPassword, checkPasswordsMatch]);

  return (
    <Form action={action} actionState={actionState}>
      <Input
        type="password"
        name="currentPassword"
        placeholder="Current Password"
        defaultValue={actionState.payload?.get("currentPassword") as string}
        minLength={6}
        required
      />
      <FieldError actionState={actionState} name="currentPassword" />

      <Input
        type="password"
        name="newPassword"
        placeholder="New Password"
        minLength={6}
        required
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <FieldError actionState={actionState} name="newPassword" />

      <Input
        type="password"
        name="confirmPassword"
        placeholder="Confirm New Password"
        minLength={6}
        required
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <FieldError actionState={actionState} name="confirmPassword" />

      {!passwordsMatch && confirmPassword && (
        <span className="text-xs text-red-500">Passwords do not match</span>
      )}

      <SubmitButton label="Change Password" />
    </Form>
  );
}

// export default function PasswordChangeForm() {
//   const [actionState, action] = useActionState(passwordChange, EMPTY_ACTION_STATE);

//   return (
//     <Form action={action} actionState={actionState}>
//       <Input
//         type="password"
//         name="password"
//         placeholder="Password"
//         defaultValue={actionState.payload?.get("password") as string}
//       />
//       <FieldError actionState={actionState} name="password" />

//       <SubmitButton label="Send Email" />
//     </Form>
//   );
// }
