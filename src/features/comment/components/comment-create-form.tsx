"use client";

import { useActionState } from "react";
import { createComment } from "../actions/create-comment";
import { EMPTY_ACTION_STATE } from "@/components/form/utils/to-action-state";
import Form from "@/components/form/form";
import { Textarea } from "@/components/ui/textarea";
import FieldError from "@/components/form/field-error";
import SubmitButton from "@/components/form/submit-button";

type CommentCreateFormProps = {
  ticketId: string;
};

export default function CommentCreateForm({
  ticketId,
}: CommentCreateFormProps) {
  const [actionState, action] = useActionState(
    createComment.bind(null, ticketId),
    EMPTY_ACTION_STATE
  );
  return (
    <Form action={action} actionState={actionState}>
      <Textarea name="content" placeholder="What's on your mind ..." />
      <FieldError actionState={actionState} name="content" />

      <SubmitButton label="Comment" />
    </Form>
  );
}
