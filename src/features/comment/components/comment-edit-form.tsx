"use client";

import { useActionState } from "react";
import { EMPTY_ACTION_STATE } from "@/components/form/utils/to-action-state";
import Form from "@/components/form/form";
import { Textarea } from "@/components/ui/textarea";
import FieldError from "@/components/form/field-error";
import SubmitButton from "@/components/form/submit-button";
import { Comment } from "@prisma/client";
import { editComment } from "../actions/edit-comment";
// import { CommentWithMetadata } from "../types";

type CommentEditFormProps = {
  comment: Comment;
  ticketId: string;
};

export default function CommentEditForm({ comment, ticketId }: CommentEditFormProps) {
  const [actionState, action] = useActionState(
    editComment.bind(null, comment.id, ticketId),
    EMPTY_ACTION_STATE
  );

  //   const handleSuccess = (actionState: ActionState<CommentWithMetadata | undefined>) => {
  //     onCreateComment?.(actionState.data);
  //   }

  return (
    <Form
      action={action}
      actionState={actionState} /*onSuccess={handleSuccess}*/
    >
      <Textarea
        name="content"
        defaultValue={
          (actionState.payload?.get("content") as string) ?? comment?.content
        }
      />
      <FieldError actionState={actionState} name="content" />

      <SubmitButton label="Edit Comment" />
    </Form>
  );
}
