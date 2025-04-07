import { s3 } from "@/lib/aws";
import { prisma } from "@/lib/prisma";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { generateS3Key } from "../utils/generate-s3-key";
import { getOrganizationIdByAttachment } from "../utils/helpers";
import { AttachmentSubject } from "../types";
import { AttachmentEntity } from "@prisma/client";

type CreateAttachmentsArgs = {
  subject: AttachmentSubject;
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
      const buffer = await Buffer.from(await file.arrayBuffer());

      attachment = await prisma.attachment.create({
        data: {
          name: file.name,
          ...(entity === "TICKET" ? { ticketId: entityId } : {}),
          ...(entity === "COMMENT" ? { commentId: entityId } : {}),
          entity,
        },
      });

      attachments.push(attachment);

      const organizationId = getOrganizationIdByAttachment(entity, subject);

      await s3.send(
        new PutObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: generateS3Key({
            organizationId,
            entityId,
            entity,
            fileName: file.name,
            attachmentId: attachment.id,
          }),
          Body: buffer,
          ContentType: file.type,
        })
      );
    }
  } catch (error) {
    // fallback if S3 upload fails, but attachment was created
    if (attachment) {
      await prisma.attachment.delete({
        where: {
          id: attachment.id,
        },
      });
    }

    throw error;
  }

  return attachments;
}
