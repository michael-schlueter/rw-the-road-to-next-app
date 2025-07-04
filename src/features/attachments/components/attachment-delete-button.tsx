"use client";

import useConfirmDialog from "@/components/confirm-dialog";
import { deleteAttachment } from "../actions/delete-attachment";
import { Button } from "@/components/ui/button";
import { LucideLoaderCircle, LucideTrash } from "lucide-react";

type AttachmentDeleteButtonProps = {
  id: string;
  onDeleteAttachment?: (id: string) => void;
};

export default function AttachmentDeleteButton({
  id,
  onDeleteAttachment,
}: AttachmentDeleteButtonProps) {
  const [deleteButton, deleteDialog] = useConfirmDialog({
    action: deleteAttachment.bind(null, id),
    loadingMessage: "Deleting attachment...",
    trigger: (isLoading) =>
      isLoading ? (
        <Button variant="ghost" size="xs">
          <LucideLoaderCircle className="h-4 w-4 animate-spin" />
        </Button>
      ) : (
        <Button variant="ghost" size="xs">
          <LucideTrash className="h-4 w-4" />
        </Button>
      ),
    onSuccess: () => onDeleteAttachment?.(id),
  });

  return (
    <>
      {deleteButton}
      {deleteDialog}
    </>
  );
}
