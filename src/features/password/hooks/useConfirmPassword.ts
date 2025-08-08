"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

type Options = {
  primaryValue: string; // the main password value to compare against
  initialConfirmValue?: string;
  debounceMs?: number;
  treatEmptyAsMatch?: boolean; // keep your current UX: no error when empty
};

export function useConfirmPassword({
  primaryValue,
  initialConfirmValue = "",
  debounceMs = 500,
  treatEmptyAsMatch = true,
}: Options) {
  const [confirmPassword, setConfirmPassword] =
    useState<string>(initialConfirmValue);
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  const onConfirmPasswordChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setConfirmPassword(e.target.value),
    []
  );

  const checkPasswordsMatch = useDebouncedCallback(() => {
    if (confirmPassword) {
      setPasswordsMatch(primaryValue === confirmPassword);
    } else {
      setPasswordsMatch(treatEmptyAsMatch);
    }
  }, debounceMs);

  useEffect(() => {
    checkPasswordsMatch();
    return () => checkPasswordsMatch.cancel();
  }, [primaryValue, confirmPassword, checkPasswordsMatch]);

  const showMismatchError = useMemo(
    () => !passwordsMatch && Boolean(confirmPassword),
    [passwordsMatch, confirmPassword]
  );

  return {
    confirmPassword,
    passwordsMatch,
    onConfirmPasswordChange,
    setConfirmPassword,
    showMismatchError,
  };
}
