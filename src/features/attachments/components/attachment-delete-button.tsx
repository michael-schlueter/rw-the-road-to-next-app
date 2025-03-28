import useConfirmDialog from "@/components/confirm-dialog";
import { deleteAttachment } from "../actions/deleteAttachment";
import { Button } from "@/components/ui/button";
import { LucideLoaderCircle, LucideTrash } from "lucide-react";

type AttachmentDeleteButtonProps = {
  id: string;
};

export default function AttachmentDeleteButton({
  id,
}: AttachmentDeleteButtonProps) {
  const [deleteButton, deleteDialog] = useConfirmDialog({
    action: deleteAttachment.bind(null, id),
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
  });

  return (
    <>
      {deleteButton}
      {deleteDialog}
    </>
  );
}
