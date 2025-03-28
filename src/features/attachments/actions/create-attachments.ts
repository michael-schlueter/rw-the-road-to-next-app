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
import { sizeInMB } from "../utils/size";
import { ACCEPTED, MAX_SIZE } from "../constants";
import { s3 } from "@/lib/aws";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { generateS3Key } from "../utils/generate-s3-key";

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
      files: formData.getAll("files"),
    });

    for (const file of files) {
      const buffer = await Buffer.from(await file.arrayBuffer());

      const attachment = await prisma.attachment.create({
        data: {
          name: file.name,
          ticketId: ticket.id,
        },
      });

      await s3.send(
        new PutObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: generateS3Key({
            organizationId: ticket.organizationId,
            ticketId: ticket.id,
            fileName: file.name,
            attachmentId: attachment.id,
          }),
          Body: buffer,
          ContentType: file.type,
        })
      );
    }
  } catch (error) {
    return fromErrorToActionState(error);
  }

  revalidatePath(ticketPath(ticketId));

  return toActionState("SUCCESS", "Attachment(s) uploaded");
}
