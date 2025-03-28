"use server";

import {
  ActionState,
  fromErrorToActionState,
  toActionState,
} from "@/components/form/utils/to-action-state";
import { getAuthOrRedirect } from "@/features/auth/queries/get-auth-or-redirect";
import { isOwner } from "@/features/auth/utils/is-owner";
import { prisma } from "@/lib/prisma";
import { ticketPath } from "@/paths";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const createAttachmentsSchema = z.object({
  files: z.custom<FileList>().transform((files) => Array.from(files)),
});

export async function createAttachments(
  ticketId: string,
  _actionState: ActionState,
  formData: FormData
) {
  const { user } = await getAuthOrRedirect();

  const ticket = await prisma.ticket.findUnique({
    where: {
      id: ticketId,
    },
  });

  if (!ticket) {
    return toActionState("ERROR", "Ticket not found");
  }

  if (!isOwner(user, ticket)) {
    return toActionState("ERROR", "Not the owner of this ticket");
  }

  try {
    const { files } = createAttachmentsSchema.parse({
        files: formData.getAll("files")
    });

    for (const file of files) {
        const buffer = await Buffer.from(await file.arrayBuffer());

        // TODO: upload to S3
        // TODO: create a database reference to S3 file
    }
  } catch (error) {
    return fromErrorToActionState(error);
  }

  revalidatePath(ticketPath(ticketId));

  return toActionState("SUCCESS", "Attachment(s) uploaded");
}
