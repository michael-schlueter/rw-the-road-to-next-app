import { prisma } from "@/lib/prisma";
import { AttachmentEntity } from "@prisma/client";

type CreateAttachmentArgs = {
  name: string;
  entity: AttachmentEntity;
  entityId: string;
};

export async function createAttachment({
  name,
  entity,
  entityId,
}: CreateAttachmentArgs) {
  return await prisma.attachment.create({
    data: {
      name,
      ...(entity === "TICKET" ? { ticketId: entityId } : {}),
      ...(entity === "COMMENT" ? { commentId: entityId } : {}),
      entity,
    },
  });
}
