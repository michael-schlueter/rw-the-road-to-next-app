"use client";

import { useActionState, useState } from "react";
import { EMPTY_ACTION_STATE } from "@/components/form/utils/to-action-state";
import Form from "@/components/form/form";
import { Input } from "@/components/ui/input";
import FieldError from "@/components/form/field-error";
import SubmitButton from "@/components/form/submit-button";
import { passwordChange } from "../actions/password-change";
import { useConfirmPassword } from "../hooks/useConfirmPassword";

export default function PasswordChangeForm() {
  const [actionState, action] = useActionState(
    passwordChange,
    EMPTY_ACTION_STATE
  );
  const [newPassword, setNewPassword] = useState(
    (actionState.payload?.get("newPassword") as string) || ""
  );

  const {
    confirmPassword,
    onConfirmPasswordChange,
    passwordsMatch,
    showMismatchError,
  } = useConfirmPassword({
    primaryValue: newPassword,
    initialConfirmValue:
      (actionState.payload?.get("confirmPassword") as string) || "",
    debounceMs: 500,
    treatEmptyAsMatch: true,
  });

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
        onChange={onConfirmPasswordChange}
      />
      <FieldError actionState={actionState} name="confirmPassword" />

      {showMismatchError && (
        <span className="text-xs text-red-500">Passwords do not match</span>
      )}

      <SubmitButton label="Change Password" disabled={!passwordsMatch} />
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
