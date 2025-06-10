"use client";

import useConfirmDialog from "@/components/confirm-dialog";
import { deleteInvitation } from "../actions/delete-invitation";
import { Button } from "@/components/ui/button";
import { LucideLoaderCircle, LucideTrash } from "lucide-react";
import { useRouter } from "next/navigation";

type InvitationDeleteButtonProps = {
  email: string;
  organizationId: string;
};

export default function InvitationDeleteButton({
  organizationId,
  email,
}: InvitationDeleteButtonProps) {
  const router = useRouter();

  const [deleteButton, deleteDialog] = useConfirmDialog({
    action: deleteInvitation.bind(null, { email, organizationId }),
    loadingMessage: "Deleting invitation...",
    trigger: (isLoading) =>
      isLoading ? (
        <Button variant="destructive" size="icon">
          <LucideLoaderCircle className="h-4 w-4 animate-spin" />
        </Button>
      ) : (
        <Button variant="destructive" size="icon">
          <LucideTrash className="w-4 h-4" />
        </Button>
      ),
    onSuccess: () => {
      router.refresh();
    },
  });

  return (
    <>
      {deleteDialog}
      {deleteButton}
    </>
  );
}
