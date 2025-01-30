"use client";

import useConfirmDialog from "@/components/confirm-dialog";
import { deleteComment } from "../actions/delete-comment";
import { Button } from "@/components/ui/button";
import { LucideTrash } from "lucide-react";

type CommentDeleteButtonProps = {
  id: string;
  onDeleteComment?: (id: string) => void;
};

export default function CommentDeleteButton({
  id,
  onDeleteComment,
}: CommentDeleteButtonProps) {
  const [deleteButton, deleteDialog] = useConfirmDialog({
    action: deleteComment.bind(null, id),
    trigger: (
      <Button variant="outline" size="icon">
        <LucideTrash className="w-4 h-4" />
      </Button>
    ),
    onSuccess: () => onDeleteComment?.(id),
  });

  return (
    <>
      {deleteDialog}
      {deleteButton}
    </>
  );
}
