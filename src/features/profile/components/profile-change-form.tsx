"use client";

import FieldError from "@/components/form/field-error";
import Form from "@/components/form/form";
import SubmitButton from "@/components/form/submit-button";
import { EMPTY_ACTION_STATE } from "@/components/form/utils/to-action-state";
import { Input } from "@/components/ui/input";
import { useActionState } from "react";
import { profileChange } from "../actions/profile-change";

type ProfileValues = {
  username: string;
  firstName: string;
  lastName: string;
};

type ProfileChangeFormProps = {
  initialValues: ProfileValues;
};

export default function ProfileChangeForm({
  initialValues,
}: ProfileChangeFormProps) {
  const [actionState, action] = useActionState(
    profileChange,
    EMPTY_ACTION_STATE
  );

  return (
    <Form action={action} actionState={actionState}>
      <Input
        type="text"
        name="username"
        placeholder="Username"
        defaultValue={
          (actionState.payload?.get("username") as string) ||
          initialValues.username
        }
      />
      <FieldError actionState={actionState} name="username" />

      <Input
        type="text"
        name="firstName"
        placeholder="First Name"
        defaultValue={
          (actionState.payload?.get("firstName") as string) ||
          initialValues.firstName
        }
      />
      <FieldError actionState={actionState} name="firstName" />

      <Input
        type="text"
        name="lastName"
        placeholder="Last Name"
        defaultValue={
          (actionState.payload?.get("lastName") as string) ||
          initialValues.lastName
        }
      />
      <FieldError actionState={actionState} name="lastName" />

      <SubmitButton label="Change Profile Information" />
    </Form>
  );
}
