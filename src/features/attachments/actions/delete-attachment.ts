"use server";

import {
  fromErrorToActionState,
  toActionState,
} from "@/components/form/utils/to-action-state";
import { getAuthOrRedirect } from "@/features/auth/queries/get-auth-or-redirect";
import { isOwner } from "@/features/auth/utils/is-owner";
import { inngest } from "@/lib/inngest";
import { prisma } from "@/lib/prisma";
import { ticketPath } from "@/paths";
import { revalidatePath } from "next/cache";
import { getAttachmentWithSubject } from "../services";

export async function deleteAttachment(id: string) {
  const { user } = await getAuthOrRedirect();

  const { attachment, subject } = await getAttachmentWithSubject(id, user.id);

  if (!subject || !attachment) {
    return toActionState("ERROR", "Subject not found");
  }

  if (!isOwner(user, subject)) {
    return toActionState("ERROR", "Not authorized");
  }

  try {
    await prisma.attachment.delete({
      where: {
        id,
      },
    });

    await inngest.send({
      name: "app/attachment.deleted",
      data: {
        organizationId: subject.organizationId,
        entityId: subject.entityId,
        entity: subject.entity,
        fileName: attachment.name,
        attachmentId: attachment.id,
      },
    });
  } catch (error) {
    return fromErrorToActionState(error);
  }

  revalidatePath(ticketPath(subject.ticketId));
  return toActionState("SUCCESS", "Attachment deleted");
}
