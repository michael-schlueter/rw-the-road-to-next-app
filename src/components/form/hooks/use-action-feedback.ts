import { useEffect, useRef } from "react";
import { ActionState } from "../utils/to-action-state";

type OnArgs = {
  actionState: ActionState;
};

type UseActionFeedbackOptions = {
  onSuccess?: (onArgs: OnArgs) => void;
  onError?: (onArgs: OnArgs) => void;
};

export function useActionFeedback(
  actionState: ActionState | undefined,
  options: UseActionFeedbackOptions
) {
  const prevTimestamp = useRef(actionState?.timestamp);
  const isUpdate = prevTimestamp.current !== actionState?.timestamp;

  useEffect(() => {
    // Run the effect only if there is a new action state
    if (!isUpdate) return;
    if (!actionState) return;

    if (actionState.status === "SUCCESS") {
      // call onSuccess handler if it is provided
      options.onSuccess?.({ actionState });
    }

    if (actionState.status === "ERROR") {
      // call onError handler if it is provided
      options.onError?.({ actionState });
    }

    prevTimestamp.current = actionState.timestamp;
  }, [isUpdate, actionState, options]);
}
