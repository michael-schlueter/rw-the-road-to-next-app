// import { s3 } from "@/lib/aws";
import { inngest } from "@/lib/inngest";
// import { DeleteObjectCommand } from "@aws-sdk/client-s3";
// import { generateS3Key } from "../utils/generate-s3-key";
import { AttachmentEntity } from "@prisma/client";
import { fileStorage } from "@/lib/storage";

export type AttachmentDeleteEventArgs = {
  data: {
    organizationId: string;
    entityId: string;
    entity: AttachmentEntity;
    fileName: string;
    attachmentId: string;
  };
};

export const attachmentDeletedEvent = inngest.createFunction(
  { id: "attachment-deleted" },
  { event: "app/attachment.deleted" },
  async ({ event }) => {
    const { organizationId, entityId, entity, fileName, attachmentId } =
      event.data;

    try {
      // await s3.send(
      //   new DeleteObjectCommand({
      //     Bucket: process.env.AWS_BUCKET_NAME,
      //     Key: generateS3Key({
      //       organizationId,
      //       entityId,
      //       entity,
      //       fileName,
      //       attachmentId,
      //     }),
      //   })
      // );
      await fileStorage.delete({
        organizationId,
        entityId,
        entity,
        fileName,
        attachmentId,
      });
    } catch (error) {
      console.log(error);
      return { event, body: false };
    }

    return { event, body: true };
  }
);
