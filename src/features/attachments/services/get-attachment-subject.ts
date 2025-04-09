import { prisma } from "@/lib/prisma";
import { AttachmentEntity } from "@prisma/client";
import * as attachmentSubjectDTO from "../dto/attachment-subject-dto";

export async function getAttachmentSubject(
  entityId: string,
  entity: AttachmentEntity,
) {
  switch (entity) {
    case "TICKET": {
      const ticket = await prisma.ticket.findUnique({
        where: {
          id: entityId,
        },
      });

      return attachmentSubjectDTO.fromTicket(ticket);
    }
    case "COMMENT": {
      const comment = await prisma.comment.findUnique({
        where: {
          id: entityId,
        },
        include: {
          ticket: true,
        },
      });

      return attachmentSubjectDTO.fromComment(comment);
    }
    default:
      return null;
  }
}
