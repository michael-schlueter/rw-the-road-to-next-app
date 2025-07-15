"use client";

import { useState } from "react";
import { DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LucidePlus } from "lucide-react";
import InvitationCreateDialog from "./invitation-create-dialog";

type InvitationCreateButtonProps = {
  organizationId: string;
};

export default function InvitationCreateButton({
  organizationId,
}: InvitationCreateButtonProps) {
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <DialogTrigger asChild>
        <Button onClick={() => setOpen(true)}>
          <LucidePlus className="w-4 h-4" />
          Invite Member
        </Button>
      </DialogTrigger>
      <InvitationCreateDialog
        organizationId={organizationId}
        open={open}
        onOpenChange={setOpen}
        onSuccess={handleClose}
      />
    </>
  );
}
