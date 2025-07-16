"use client";

import { Button } from "@/components/ui/button";
import { LucidePlus } from "lucide-react";
import DialogForm from "@/components/form/dialog-form";
import { createInvitation } from "../actions/create-invitation";
import { EMPTY_ACTION_STATE } from "@/components/form/utils/to-action-state";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import FieldError from "@/components/form/field-error";

type InvitationCreateButtonProps = {
  organizationId: string;
};

export default function InvitationCreateButton({
  organizationId,
}: InvitationCreateButtonProps) {
  return (
    <DialogForm
      trigger={
        <Button>
          <LucidePlus className="w-4 h-4" />
          Invite Member
        </Button>
      }
      title="Invite Member"
      description="Invite a user by email to your organization"
      formAction={createInvitation.bind(null, organizationId)}
      initialActionState={EMPTY_ACTION_STATE}
      submitLabel="Invite"
    >
      {(actionState) => (
        <div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input name="email" id="email" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <div />
            <div className="col-span-3">
              <FieldError actionState={actionState} name="email" />
            </div>
          </div>
        </div>
      )}
    </DialogForm>
  );
}
