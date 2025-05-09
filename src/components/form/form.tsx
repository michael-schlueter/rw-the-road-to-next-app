import { toast, ToastT } from "sonner";
import { useActionFeedback } from "./hooks/use-action-feedback";
import { ActionState } from "./utils/to-action-state";

type FormProps = {
  children: React.ReactNode;
  action: (payload: FormData) => void;
  actionState: ActionState;
  onSuccess?: (actionState: ActionState) => void;
  onError?: (actionState: ActionState) => void;
  toastOptions?: Omit<ToastT, "id">;
};

export default function Form({
  children,
  action,
  actionState,
  onSuccess,
  onError,
  toastOptions,
}: FormProps) {
  useActionFeedback(actionState, {
    // provide actionState again in case it changed
    // use object with destructuring to be able to easer add additional arguments
    onSuccess: ({ actionState }) => {
      if (actionState.message) {
        toast.success(actionState.message, toastOptions);
      }

      onSuccess?.(actionState);
    },
    onError: ({ actionState }) => {
      if (actionState.message) {
        toast.error(actionState.message, toastOptions);
      }

      onError?.(actionState);
    },
  });

  return (
    <form className="flex flex-col gap-y-2" action={action}>
      {children}
    </form>
  );
}
