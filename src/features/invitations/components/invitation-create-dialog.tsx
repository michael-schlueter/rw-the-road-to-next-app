"use client";

import { useActionState } from "react";
import { createInvitation } from "../actions/create-invitation";
import { EMPTY_ACTION_STATE } from "@/components/form/utils/to-action-state";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Form from "@/components/form/form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import FieldError from "@/components/form/field-error";
import { Button } from "@/components/ui/button";
import SubmitButton from "@/components/form/submit-button";

type InvitationCreateDialogProps = {
  organizationId: string;
  onCancel: () => void;
  onSuccess: () => void;
};

export default function InvitationCreateDialog({
  organizationId,
  onSuccess,
  onCancel,
}: InvitationCreateDialogProps) {
  const [actionState, action] = useActionState(
    createInvitation.bind(null, organizationId),
    EMPTY_ACTION_STATE
  );

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Invite Member</DialogTitle>
        <DialogDescription>
          Invite a user by email to your organization
        </DialogDescription>
      </DialogHeader>
      <Form action={action} actionState={actionState} onSuccess={onSuccess}>
        <div className="grid gap-4 py-4">
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
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <SubmitButton label="Invite" />
        </DialogFooter>
      </Form>
    </DialogContent>
  );
}
