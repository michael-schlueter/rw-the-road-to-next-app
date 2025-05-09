import * as attachmentData from "@/features/attachments/data";
import { AttachmentSubjectDTO } from "../dto/attachment-subject-dto";

export async function getAttachmentWithSubject(attackmentId: string, userId: string) {
  const attachment = await attachmentData.getAttachment(attackmentId);

  let subject;
  switch (attachment?.entity) {
    case "TICKET":
      subject = AttachmentSubjectDTO.fromTicket(attachment.ticket);
      break;
    case "COMMENT":
      subject = AttachmentSubjectDTO.fromComment(attachment.comment, userId);
      break;
  }

  return { attachment, subject };
}
