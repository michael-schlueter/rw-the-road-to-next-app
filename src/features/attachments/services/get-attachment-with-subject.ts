import * as attachmentData from "@/features/attachments/data";
import { AttachmentSubjectDTO } from "../dto/attachment-subject-dto";
import { Attachment, Comment, Ticket } from "@prisma/client";
import { AttachmentSubject } from "../types";

type AttachmentWithRelations = Attachment & {
  ticket?: Ticket | null;
  comment?: (Comment & { ticket?: Ticket | null }) | null;
};

export async function getAttachmentWithSubject(
  attackmentId: string,
  userId: string
) {
  const attachment = (await attachmentData.getAttachment(attackmentId, {
    includeTicket: true,
    includeComment: true,
    includeCommentTicket: true,
  })) as AttachmentWithRelations;

  let subject;
  switch (attachment?.entity) {
    case "TICKET":
      subject = AttachmentSubjectDTO.fromTicket(attachment.ticket as unknown as AttachmentSubject);
      break;
    case "COMMENT":
      subject = AttachmentSubjectDTO.fromComment(attachment.comment as unknown as AttachmentSubject, userId);
      break;
  }

  return { attachment, subject };
}
