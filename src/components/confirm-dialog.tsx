import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  cloneElement,
  useActionState,
  useEffect,
  useRef,
  useState,
} from "react";
import { ActionState, EMPTY_ACTION_STATE } from "./form/utils/to-action-state";
import { toast } from "sonner";
import { useActionFeedback } from "./form/hooks/use-action-feedback";
import { Button } from "./ui/button";

type UseConfirmDialogArgs = {
  title?: string;
  description?: string;
  action: () => Promise<ActionState | undefined>;
  trigger: React.ReactElement | ((isLoading: boolean) => React.ReactElement);
  onSuccess?: (actionState: ActionState) => void;
  loadingMessage?: string;
};

export default function useConfirmDialog({
  title = "Are you absolutely sure?",
  description = "This action cannot be undone. Make sure you understand the consequences",
  action,
  trigger,
  onSuccess,
  loadingMessage = "Processing...",
}: UseConfirmDialogArgs) {
  const [isOpen, setIsOpen] = useState(false);

  const [actionState, formAction, isPending] = useActionState(
    action,
    EMPTY_ACTION_STATE
  );

  const dialogTrigger = cloneElement(
    typeof trigger === "function" ? trigger(isPending) : trigger,
    {
      onClick: () => setIsOpen((state) => !state),
    }
  );

  const toastRef = useRef<string | number | null>(null);

  useEffect(() => {
    if (isPending) {
      toastRef.current = toast.loading(loadingMessage);
    } else if (toastRef.current) {
      toast.dismiss(toastRef.current);
    }

    // make sure toast message is removed even after redirecting
    return () => {
      if (toastRef.current) {
        toast.dismiss(toastRef.current);
      }
    };
  }, [isPending, loadingMessage]);

  useActionFeedback(actionState, {
    onSuccess: ({ actionState }) => {
      if (actionState.message) {
        toast.success(actionState.message);
      }
      setIsOpen(false);
      onSuccess?.(actionState);
    },
    onError: ({ actionState }) => {
      if (actionState.message) {
        toast.error(actionState.message);
      }
    },
  });

  const dialog = (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <form action={formAction}>
              <Button type="submit">Confirm</Button>
            </form>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
  return [dialogTrigger, dialog] as const;
}
