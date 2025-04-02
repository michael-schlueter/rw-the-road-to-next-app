"use client";

import { useActionState } from "react";
import { createAttachments } from "../actions/create-attachments";
import { EMPTY_ACTION_STATE } from "@/components/form/utils/to-action-state";
import Form from "@/components/form/form";
import { Input } from "@/components/ui/input";
import { ACCEPTED } from "../constants";
import FieldError from "@/components/form/field-error";
import SubmitButton from "@/components/form/submit-button";
import { AttachmentEntity } from "@prisma/client";

type AttachmentCreateFormProps = {
  entityId: string;
  entity: AttachmentEntity;
};

export default function AttachmentCreateForm({
  entityId,
  entity,
}: AttachmentCreateFormProps) {
  const [actionState, action] = useActionState(
    createAttachments.bind(null, { entityId, entity }),
    EMPTY_ACTION_STATE
  );

  return (
    <Form action={action} actionState={actionState}>
      <Input
        name="files"
        id="files"
        type="file"
        multiple
        accept={ACCEPTED.join(",")}
      />
      <FieldError actionState={actionState} name="files" />
      <SubmitButton label="Upload" />
    </Form>
  );
}
