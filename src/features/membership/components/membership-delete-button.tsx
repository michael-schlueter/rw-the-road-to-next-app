"use client";

import useConfirmDialog from "@/components/confirm-dialog";
import { useRouter } from "next/navigation";
import { deleteMembership } from "../actions/delete-membership";
import { Button } from "@/components/ui/button";
import { LucideLoaderCircle, LucideLogOut } from "lucide-react";

type MembershipDeleteButtonProps = {
  userId: string;
  organizationId: string;
};

export default function MembershipDeleteButton({
  userId,
  organizationId,
}: MembershipDeleteButtonProps) {
  const router = useRouter();

  const [deleteButton, deleteDialog] = useConfirmDialog({
    action: deleteMembership.bind(null, {
      userId,
      organizationId,
    }),
    loadingMessage: "Deleting membership...",
    trigger: (isLoading) =>
      isLoading ? (
        <Button variant="destructive" size="icon">
          <LucideLoaderCircle className="h-4 w-4 animate-spin" />
        </Button>
      ) : (
        <Button variant="destructive" size="icon">
          <LucideLogOut className="h-4 w-4" />
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
