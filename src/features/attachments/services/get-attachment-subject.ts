import { AttachmentEntity, User } from "@prisma/client";
import { AttachmentSubjectDTO } from "../dto/attachment-subject-dto";
import * as ticketData from "@/features/ticket/data";
import * as commentData from "@/features/comment/data";

export async function getAttachmentSubject(
  entityId: string,
  entity: AttachmentEntity,
  user: User
) {
  switch (entity) {
    case "TICKET": {
      const ticket = await ticketData.findTicketById(entityId);

      return AttachmentSubjectDTO.fromTicket(ticket);
    }
    case "COMMENT": {
      const comment = await commentData.findCommentById(entityId, { includeTicket: true });

      return AttachmentSubjectDTO.fromComment(comment, user.id);
    }
    default:
      return null;
  }
}
