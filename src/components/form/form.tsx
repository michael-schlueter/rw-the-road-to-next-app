import { toast } from "sonner";
import { useActionFeedback } from "./hooks/use-action-feedback";
import { ActionState } from "./utils/to-action-state";

type FormProps = {
  children: React.ReactNode;
  action: (payload: FormData) => void;
  actionState: ActionState;
};

export default function Form({ children, action, actionState }: FormProps) {
  useActionFeedback(actionState, {
    // provide actionState again in case it changed
    // use object with destructuring to be able to easer add additional arguments
    onSuccess: ({ actionState }) => {
      if (actionState.message) {
        toast.success(actionState.message);
      }
    },
    onError: ({ actionState }) => {
      if (actionState.message) {
        toast.error(actionState.message);
      }
    },
  });
  
  return (
    <form className="flex flex-col gap-y-2" action={action}>
      {children}
    </form>
  );
}
