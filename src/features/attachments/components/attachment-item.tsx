import { Attachment } from "@prisma/client";

type AttachmentItemProps = {
  attachment: Attachment;
  buttons: React.ReactNode[];
};

export default function AttachmentItem({
  attachment,
  buttons,
}: AttachmentItemProps) {
  return (
    <div className="flex justify-between items-center">
      <p className="text-sm">{attachment.name}</p>;
      {buttons}
    </div>
  );
}
