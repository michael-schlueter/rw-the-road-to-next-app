import { s3 } from "@/lib/aws";
import { prisma } from "@/lib/prisma";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { generateS3Key } from "../utils/generate-s3-key";
import { AttachmentEntity } from "@prisma/client";
import * as attachmentData from "../data";

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
      const buffer = await Buffer.from(await file.arrayBuffer());

      attachment = await attachmentData.createAttachment({
        name: file.name,
        entity,
        entityId,
        type: file.type,
      });

      attachments.push(attachment);

      await s3.send(
        new PutObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: generateS3Key({
            organizationId: subject.organizationId,
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
