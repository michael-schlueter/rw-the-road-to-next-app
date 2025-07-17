import { prisma } from "@/lib/prisma";
import { AttachmentEntity } from "@prisma/client";

type CreateAttachmentArgs = {
  name: string;
  entity: AttachmentEntity;
  entityId: string;
  type: string;
};

export async function createAttachment({
  name,
  entity,
  entityId,
  type,
}: CreateAttachmentArgs) {
  return await prisma.attachment.create({
    data: {
      name,
      ...(entity === "TICKET" ? { ticketId: entityId } : {}),
      ...(entity === "COMMENT" ? { commentId: entityId } : {}),
      entity,
      type,
    },
  });
}
