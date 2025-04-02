import CardCompact from "@/components/card-compact";
import AttachmentCreateForm from "./attachment-create-form";
import { getAttachments } from "../queries/get-attachments";
import AttachmentList from "./attachment-list";
import AttachmentDeleteButton from "./attachment-delete-button";

type AttachmentProps = {
  ticketId: string;
  isOwner: boolean;
};

export default async function Attachments({
  ticketId,
  isOwner,
}: AttachmentProps) {
  const attachments = await getAttachments(ticketId);
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
          {isOwner && <AttachmentCreateForm ticketId={ticketId} />}
        </>
      }
    ></CardCompact>
  );
}
