import { inngest } from "@/lib/inngest";
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
