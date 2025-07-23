import { inngest } from "@/lib/inngest";
import { fileStorage } from "@/lib/storage";

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
          await fileStorage.delete({
            organizationId,
            entityId: ticketId,
            entity: "TICKET",
            fileName,
            attachmentId,
          });

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
