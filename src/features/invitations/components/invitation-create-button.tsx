"use client";

import { useState } from "react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <LucidePlus className="w-4 h-4" />
          Invite Member
        </Button>
      </DialogTrigger>
      <InvitationCreateDialog
        organizationId={organizationId}
        onCancel={() => setOpen(false)}
        onSuccess={handleClose}
      />
    </Dialog>
  );
}
