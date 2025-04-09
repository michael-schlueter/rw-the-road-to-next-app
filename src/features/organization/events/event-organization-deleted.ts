import { generateS3Key } from "@/features/attachments/utils/generate-s3-key";
import { s3 } from "@/lib/aws";
import { inngest } from "@/lib/inngest";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";

type Attachment = {
  attachmentId: string;
  fileName: string;
};

type Ticket = {
  ticketId: string;
  attachments: Attachment[];
};

export type OrganizationDeleteEventArgs = {
  data: {
    organizationId: string;
    tickets: Ticket[];
  };
};

export const organizationDeletedEvent = inngest.createFunction(
  { id: "organization-deleted" },
  { event: "app/organization.deleted" },
  async ({ event }) => {
    const { organizationId, tickets } = event.data;
    const deleteResults = [];

    try {
      // Loop through each ticket and its attachments
      for (const ticket of tickets) {
        const ticketId = ticket.ticketId;

        // Process each attachment for this ticket
        for (const attachment of ticket.attachments) {
          const { fileName, attachmentId } = attachment;

          // Delete the attachment from S3
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
