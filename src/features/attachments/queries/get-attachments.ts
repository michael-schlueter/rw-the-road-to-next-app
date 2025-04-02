import { prisma } from "@/lib/prisma";
import { AttachmentEntity } from "@prisma/client";

export async function getAttachments(
  entityId: string,
  entity: AttachmentEntity
) {
  switch (entity) {
    case "TICKET": {
      return await prisma.attachment.findMany({
        where: {
          ticketId: entityId,
        },
      });
    }
    case "COMMENT": {
      return await prisma.attachment.findMany({
        where: {
          commentId: entityId,
        },
      });
    }
    default:
      return [];
  }
}
