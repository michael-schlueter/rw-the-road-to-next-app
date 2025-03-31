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

export async function deleteAttachment(id: string) {
  const { user } = await getAuthOrRedirect();

  const attachment = await prisma.attachment.findUniqueOrThrow({
    where: {
      id,
    },
    include: {
      ticket: true,
    },
  });

  if (!isOwner(user, attachment.ticket)) {
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
        organizationId: attachment.ticket.organizationId,
        ticketId: attachment.ticket.id,
        fileName: attachment.name,
        attachmentId: id,
      },
    });
  } catch (error) {
    return fromErrorToActionState(error);
  }

  revalidatePath(ticketPath(id));

  return toActionState("SUCCESS", "Attachment deleted");
}
