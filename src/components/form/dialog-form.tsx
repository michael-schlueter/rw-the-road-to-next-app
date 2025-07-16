import { useActionState, useState } from "react";
import { ActionState } from "./utils/to-action-state";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import Form from "./form";
import { Button } from "../ui/button";
import SubmitButton from "./submit-button";

type DialogFormProps = {
  trigger: React.ReactNode;
  title: string;
  description: string;
  formAction: (
    state: ActionState,
    payload: FormData
  ) => Promise<ActionState> | ActionState;
  initialActionState: ActionState;
  children: (actionState: ActionState) => React.ReactNode;
  submitLabel: string;
  cancelLabel?: string;
  onSuccess?: (actionState: ActionState) => void;
};

export default function DialogForm({
  trigger,
  title,
  description,
  formAction,
  initialActionState,
  children,
  submitLabel,
  cancelLabel = "Cancel",
  onSuccess,
}: DialogFormProps) {
  const [open, setOpen] = useState(false);
  const [actionState, action] = useActionState(formAction, initialActionState);

  const handleSuccess = (state: ActionState) => {
    onSuccess?.(state);
    setOpen(false);
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <Form
          action={action}
          actionState={actionState}
          onSuccess={handleSuccess}
        >
          <div className="grid gap-4 py-4">{children(actionState)}</div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              {cancelLabel}
            </Button>
            <SubmitButton label={submitLabel} />
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
