"use client";

import { useActionState } from "react";
import { createComment } from "../actions/create-comment";
import {
  ActionState,
  EMPTY_ACTION_STATE,
} from "@/components/form/utils/to-action-state";
import Form from "@/components/form/form";
import { Textarea } from "@/components/ui/textarea";
import FieldError from "@/components/form/field-error";
import SubmitButton from "@/components/form/submit-button";
import { CommentWithMetadata } from "../types";
import { Input } from "@/components/ui/input";
import { ACCEPTED } from "@/features/attachments/constants";

type CommentCreateFormProps = {
  ticketId: string;
  onCreateComment?: (comment: CommentWithMetadata | undefined) => void;
};

export default function CommentCreateForm({
  ticketId,
  onCreateComment,
}: CommentCreateFormProps) {
  const [actionState, action] = useActionState(
    createComment.bind(null, ticketId),
    EMPTY_ACTION_STATE
  );

  const handleSuccess = (
    actionState: ActionState<CommentWithMetadata | undefined>
  ) => {
    onCreateComment?.(actionState.data);
  };
  return (
    <Form action={action} actionState={actionState} onSuccess={handleSuccess}>
      <Textarea name="content" placeholder="What's on your mind ..." />
      <FieldError actionState={actionState} name="content" />

      <Input
        name="files"
        id="files"
        type="file"
        multiple
        accept={ACCEPTED.join(",")}
      />
      <FieldError actionState={actionState} name="files" />

      <SubmitButton label="Comment" />
    </Form>
  );
}
