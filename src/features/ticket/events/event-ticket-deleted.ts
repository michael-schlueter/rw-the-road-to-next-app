import { inngest } from "@/lib/inngest";
import { fileStorage } from "@/lib/storage";

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

        await fileStorage.delete({
          organizationId,
          entityId: ticketId,
          entity: "TICKET",
          fileName,
          attachmentId,
        });

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
