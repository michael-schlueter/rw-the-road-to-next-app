import { generateS3Key } from "@/features/attachments/utils/generate-s3-key";
import { s3 } from "@/lib/aws";
import { inngest } from "@/lib/inngest";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";

export type TickettDeleteEventArgs = {
  data: {
    organizationId: string;
    ticketId: string;
    attachments: Array<{
      fileName: string;
      attachmentId: string;
    }>;
  };
};

export const ticketDeletedEvent = inngest.createFunction(
  { id: "ticket-deleted" },
  { event: "app/ticket.deleted" },
  async ({ event }) => {
    const { ticketId, organizationId, attachments = [] } = event.data;
    const deleteResults = [];

    try {
      // Loop through each attachment and delete it
      for (const attachment of attachments) {
        const { fileName, attachmentId } = attachment;

        await s3.send(
          new DeleteObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: generateS3Key({
              organizationId,
              entityId: ticketId,
              entity: "TICKET",
              fileName,
              attachmentId,
            }),
          })
        );

        deleteResults.push({ attachmentId, fileName, deleted: true });
      }
    } catch (error) {
      console.log(error);
      return { event, body: false };
    }

    return {
      event,
      body: { success: true, deletedAttachments: deleteResults },
    };
  }
);
