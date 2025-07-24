import * as attachmentData from "@/features/attachments/data";
import { AttachmentSubjectDTO } from "../dto/attachment-subject-dto";
import { Attachment, Comment, Ticket } from "@prisma/client";

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

  const subject = AttachmentSubjectDTO.fromAttachment(attachment, userId);

  return { attachment, subject };
}
