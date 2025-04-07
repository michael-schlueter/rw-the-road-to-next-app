"use server";

import {
  ActionState,
  fromErrorToActionState,
  toActionState,
} from "@/components/form/utils/to-action-state";
import { getAuthOrRedirect } from "@/features/auth/queries/get-auth-or-redirect";
import { isOwner } from "@/features/auth/utils/is-owner";
import { ticketPath } from "@/paths";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { sizeInMB } from "../utils/size";
import { ACCEPTED, MAX_SIZE } from "../constants";
import { AttachmentEntity } from "@prisma/client";
import { isComment, isTicket } from "../types";
import * as attachmentService from "../services";

const createAttachmentsSchema = z.object({
  files: z
    .custom<FileList>()
    .transform((files) => Array.from(files))
    .transform((files) => files.filter((file) => file.size > 0))
    .refine(
      (files) => files.every((file) => sizeInMB(file.size) <= MAX_SIZE),
      `The maximum file size is ${MAX_SIZE}MB`
    )
    .refine(
      (files) => files.every((file) => ACCEPTED.includes(file.type)),
      "File type is not supported"
    )
    .refine((files) => files.length !== 0, "File is required"),
});

type CreateAttachmentArgs = {
  entityId: string;
  entity: AttachmentEntity;
};

export async function createAttachments(
  { entityId, entity }: CreateAttachmentArgs,
  _actionState: ActionState,
  formData: FormData
) {
  const { user } = await getAuthOrRedirect();

  const subject = await attachmentService.getAttachmentSubject(
    entityId,
    entity
  );

  if (!subject) {
    return toActionState("ERROR", "Subject not found");
  }

  if (!isOwner(user, subject)) {
    return toActionState("ERROR", "Not the owner of this subject");
  }

  try {
    const { files } = createAttachmentsSchema.parse({
      files: formData.getAll("files"),
    });

    await attachmentService.createAttachments({
      subject,
      entity,
      entityId,
      files,
    });
  } catch (error) {
    return fromErrorToActionState(error);
  }

  switch (entity) {
    case "TICKET":
      if (isTicket(subject)) {
        revalidatePath(ticketPath(subject.id));
      }
      break;
    case "COMMENT":
      if (isComment(subject)) {
        revalidatePath(ticketPath(subject.ticket.id));
      }
      break;
  }

  return toActionState("SUCCESS", "Attachment(s) uploaded");
}
