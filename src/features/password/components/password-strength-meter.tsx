"use client";

import { useEffect, useRef, useState } from "react";
import {
  calculatePasswordStrength,
  PasswordStrengthResult,
  strengthLevels,
} from "../utils/calculate-password-strength";
import { cn } from "@/lib/utils";
import { useDebouncedCallback } from "use-debounce";

type PasswordStrengthMeterProps = {
  password: string;
  onStrengthChange?: (strength: PasswordStrengthResult) => void;
  className?: string;
};

export default function PasswordStrengthMeter({
  password,
  onStrengthChange,
  className,
}: PasswordStrengthMeterProps) {
  const [strength, setStrength] = useState<PasswordStrengthResult>(null);
  const isMountedRef = useRef(true);

  // Store the callback in a ref to avoid dependency issues
  const onStrengthChangeRef = useRef(onStrengthChange);

  // Update the ref when the callback changes
  useEffect(() => {
    onStrengthChangeRef.current = onStrengthChange;
  }, [onStrengthChange]);

  // Create a debounced function to calculate password strength
  const debouncedCalculatePasswordStrength = useDebouncedCallback(
    async (value: string) => {
      if (!isMountedRef.current) return;

      if (!value) {
          setStrength(null);
          if (onStrengthChangeRef.current) {
            onStrengthChangeRef.current(null);
        }
        return;
      }

      try {
        const result = await calculatePasswordStrength(value);

        if (isMountedRef.current) {
          setStrength(result);
          if (onStrengthChangeRef.current) {
            onStrengthChangeRef.current(result);
          }
        }
      } catch (error) {
        console.error("Error calculating password strength: ", error);
      }
    },
    250
  );

  // Calculate strength when password changes
  useEffect(() => {
    isMountedRef.current = true;

    debouncedCalculatePasswordStrength(password);

    return () => {
      isMountedRef.current = false;
    };
  }, [password, debouncedCalculatePasswordStrength]);

  return (
    <div className={cn("space-y-2", className)}>
      {/* Background bar */}
      <div
        className="h-2 w-full bg-gray-200 rounded overflow-hidden relative"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={4}
        aria-valuenow={strength?.score ?? 0}
        aria-label={strength?.label || "Password strength"}
      >
        {/* Colored overlay */}
        <div
          className={cn(
            "absolute top-0 left-0 h-full rounded transition-all duration-500 ease-out",
            strength !== null ? "opacity-100" : "opacity-0",
            strength !== null
              ? strengthLevels[strength.score].color
              : "bg-transparent",
            strength !== null ? strengthLevels[strength.score].width : "w-0"
          )}
        ></div>
      </div>
      {/* Strength Label */}
      <div className="h-4">
        <p className="text-xs text-muted-foreground transition-opacity duration-300 ease-in-out">
          {strength === null
            ? "Password strength"
            : `Strength: ${strength.label}`}
        </p>
      </div>
    </div>
  );
}
