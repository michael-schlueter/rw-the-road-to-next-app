import CardCompact from "@/components/card-compact";
// import AttachmentCreateForm from "./attachment-create-form";
import { getAttachments } from "../queries/get-attachments";
import AttachmentList from "./attachment-list";
import AttachmentDeleteButton from "./attachment-delete-button";
import { AttachmentEntity } from "@prisma/client";

type AttachmentProps = {
  entityId: string;
  entity: AttachmentEntity;
  isOwner: boolean;
};

export default async function Attachments({
  entityId,
  entity,
  isOwner,
}: AttachmentProps) {
  const attachments = await getAttachments(entityId, entity);
  return (
    <CardCompact
      title="Attachments"
      description="Attached images or PDFs"
      content={
        <>
          <AttachmentList
            attachments={attachments}
            isOwner={isOwner}
            buttons={(attachmentId: string) => [
              ...(isOwner
                ? [<AttachmentDeleteButton key="0" id={attachmentId} />]
                : []),
            ]}
          />
          {/* {isOwner && <AttachmentCreateForm ticketId={ticketId} />} */}
        </>
      }
    ></CardCompact>
  );
}
