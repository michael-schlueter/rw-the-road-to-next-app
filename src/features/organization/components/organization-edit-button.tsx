"use client";

import { useActionState, useState } from "react";
import { ActionState, EMPTY_ACTION_STATE } from "@/components/form/utils/to-action-state";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LucidePen } from "lucide-react";
import Form from "@/components/form/form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import FieldError from "@/components/form/field-error";
import SubmitButton from "@/components/form/submit-button";
import { editOrganization } from "../actions/edit-organization";
import { useQueryClient } from "@tanstack/react-query";
import { ACTIVE_ORGANIZATION_QUERY_KEY } from "../hooks/use-active-organization";

type OrganizationEditButtonProps = {
  organizationId: string;
  organizationName: string;
};

export default function OrganizationEditButton({
  organizationId,
  organizationName,
}: OrganizationEditButtonProps) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const [actionState, action] = useActionState(async (_prevState: ActionState, formData: FormData) => {
    const result = await editOrganization(organizationId, formData);

    if (result.status === "SUCCESS") {
      await queryClient.refetchQueries({
        queryKey: ACTIVE_ORGANIZATION_QUERY_KEY,
        exact: true,
      });
    }

    return result;
  }, EMPTY_ACTION_STATE);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <LucidePen className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Organization</DialogTitle>
          <DialogDescription>
            Edit the name of the organization
          </DialogDescription>
        </DialogHeader>
        <Form action={action} actionState={actionState} onSuccess={handleClose}>
          <div className="grid gap-4 py-4">
            <div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Organization Name
                </Label>
                <Input
                  name="name"
                  id="name"
                  className="col-span-3"
                  defaultValue={organizationName}
                  required
                />
              </div>
              <div className="grid grid-cos-4 items-center gap-4">
                <div />
                <div className="col-span-3">
                  <FieldError actionState={actionState} name="name" />
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <SubmitButton label="Edit" />
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
