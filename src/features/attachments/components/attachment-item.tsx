import { attachmentDownloadPath } from "@/paths";
import { Attachment } from "@prisma/client";
import { ArrowUpRightFromSquareIcon } from "lucide-react";
import Link from "next/link";

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
      <Link
        className="flex gap-x-2 items-center text-sm truncate"
        href={attachmentDownloadPath(attachment.id)}
      >
        <ArrowUpRightFromSquareIcon className="h-4 w-4" />
        {attachment.name}
      </Link>
      {buttons}
    </div>
  );
}
