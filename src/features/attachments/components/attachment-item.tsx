import { Attachment } from "@prisma/client";

type AttachmentItemProps = {
  attachment: Attachment;
};

export default function AttachmentItem({ attachment }: AttachmentItemProps) {
  return <p className="text-sm">{attachment.name}</p>;
}
