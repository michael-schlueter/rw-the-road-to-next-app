import { attachmentDownloadPath } from "@/paths";
import { Attachment } from "@prisma/client";
import {
  ArrowUpRightFromSquareIcon,
  LucideFile,
  LucideImage,
} from "lucide-react";
import Link from "next/link";

type AttachmentItemProps = {
  attachment: Attachment;
  buttons: React.ReactNode[];
};

export default function AttachmentItem({
  attachment,
  buttons,
}: AttachmentItemProps) {
  const AttachmentIcon = ({ type }: { type: string }) => {
    if (type.startsWith("image/")) {
      return <LucideImage className="h-4 w-4" />;
    }

    return <LucideFile className="h-4 w-4" />;
  };

  return (
    <div className="flex justify-between items-center">
      <Link
        className="flex gap-x-2 items-center text-sm truncate"
        href={attachmentDownloadPath(attachment.id)}
      >
        <ArrowUpRightFromSquareIcon className="h-4 w-4" />
        <AttachmentIcon type={attachment.type} />
        {attachment.name}
      </Link>
      {buttons}
    </div>
  );
}
