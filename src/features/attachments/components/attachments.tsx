import CardCompact from "@/components/card-compact";
import AttachmentCreateForm from "./attachment-create-form";
import { getAttachments } from "../queries/get-attachments";
import AttachmentItem from "./attachment-item";

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
          <div className="mx-2 flex flex-col gap-y-2 mb-4">
            {attachments.map((attachment) => (
              <AttachmentItem key={attachment.id} attachment={attachment} />
            ))}
          </div>
          {isOwner && <AttachmentCreateForm ticketId={ticketId} />}
        </>
      }
    ></CardCompact>
  );
}
