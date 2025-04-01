import { Button } from "@/components/ui/button";
import { commentEditPath } from "@/paths";
import { LucidePencil } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function CommentEditButton({
  commentId,
  ticketId,
}: {
  commentId: string;
  ticketId: string;
}) {
  return (
    <Button asChild size="icon" variant="outline">
      <Link
        prefetch
        href={commentEditPath(ticketId, commentId)}
        className="text-sm underline"
      >
        <LucidePencil className="h-4 w-4" />
      </Link>
    </Button>
  );
}
