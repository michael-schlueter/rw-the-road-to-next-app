import { AttachmentEntity } from "@prisma/client";
import * as attachmentData from "../data";
import { fileStorage } from "@/lib/storage";

type CreateAttachmentsArgs = {
  subject: {
    entityId: string;
    entity: AttachmentEntity;
    organizationId: string;
    userId: string;
    ticketId: string;
    commentId: string | null;
  };
  entity: AttachmentEntity;
  entityId: string;
  files: File[];
};

export async function createAttachments({
  subject,
  entity,
  entityId,
  files,
}: CreateAttachmentsArgs) {
  const attachments = [];
  let attachment;

  try {
    for (const file of files) {
      // const buffer = await Buffer.from(await file.arrayBuffer());

      attachment = await attachmentData.createAttachment(
        entity === "TICKET"
          ? {
              name: file.name,
              entity,
              ticketId: entityId,
              type: file.type,
            }
          : {
              name: file.name,
              entity,
              commentId: entityId,
              type: file.type,
            }
      );

      attachments.push(attachment);

      await fileStorage.uploadFile(
        {
          organizationId: subject.organizationId,
          entityId,
          entity,
          attachmentId: attachment.id,
        },
        file
      );
    }
  } catch (error) {
    // fallback if S3 upload fails, but attachment was created
    if (attachment) {
      await attachmentData.deleteAttachment(attachment.id);
    }

    throw error;
  }

  return attachments;
}
