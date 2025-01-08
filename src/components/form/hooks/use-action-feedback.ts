import { useEffect } from "react";
import { ActionState } from "../utils/to-action-state";

type OnArgs = {
  actionState: ActionState;
};

type UseActionFeedbackOptions = {
  onSuccess?: (onArgs: OnArgs) => void;
  onError?: (OnArgs: OnArgs) => void;
};

export function useActionFeedback(
  actionState: ActionState,
  options: UseActionFeedbackOptions
) {
  useEffect(() => {
    if (actionState.status === "SUCCESS") {
      // call onSuccess handler if it is provided
      options.onSuccess?.({ actionState });
    }

    if (actionState.status === "ERROR") {
      // call onError handler if it is provided
      options.onError?.({ actionState });
    }
  }, [actionState, options]);
}
