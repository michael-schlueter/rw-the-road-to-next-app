import { prisma } from "@/lib/prisma";
import { AttachmentEntity, User } from "@prisma/client";
import { AttachmentSubjectDTO } from "../dto/attachment-subject-dto";

export async function getAttachmentSubject(
  entityId: string,
  entity: AttachmentEntity,
  user: User
) {
  switch (entity) {
    case "TICKET": {
      const ticket = await prisma.ticket.findUnique({
        where: {
          id: entityId,
        },
      });

      return AttachmentSubjectDTO.fromTicket(ticket);
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

      return AttachmentSubjectDTO.fromComment(comment, user.id);
    }
    default:
      return null;
  }
}
