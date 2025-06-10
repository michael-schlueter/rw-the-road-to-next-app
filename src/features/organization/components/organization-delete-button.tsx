"use client";

import useConfirmDialog from "@/components/confirm-dialog";
import React from "react";
import { deleteOrganization } from "../actions/delete-organization";
import { Button } from "@/components/ui/button";
import { LucideLoaderCircle, LucideTrash } from "lucide-react";
import { useRouter } from "next/navigation";

type OrganizationDeleteButtonProps = {
  organizationId: string;
};

export default function OrganizationDeleteButton({
  organizationId,
}: OrganizationDeleteButtonProps) {
  const router = useRouter();

  const [deleteButton, deleteDialog] = useConfirmDialog({
    action: deleteOrganization.bind(null, organizationId),
    loadingMessage: "Deleting organization...",
    trigger: (isPending) => (
      <Button variant="destructive" size="icon">
        {isPending ? (
          <LucideLoaderCircle className="w-4 h-4 animate-spin" />
        ) : (
          <LucideTrash className="w-4 h-4" />
        )}
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
