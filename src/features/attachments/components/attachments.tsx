import CardCompact from "@/components/card-compact";
import AttachmentCreateForm from "./attachment-create-form";

type AttachmentProps = {
  ticketId: string;
  isOwner: boolean;
};

export default function Attachments({ ticketId, isOwner }: AttachmentProps) {
  return (
    <CardCompact
      title="Attachments"
      description="Attached images or PDFs"
      content={
        <>
          {/* TODO: list attachments */}
          {isOwner && <AttachmentCreateForm ticketId={ticketId} />}
        </>
      }
    ></CardCompact>
  );
}
