"use client";

import { useEffect, useState, useTransition } from "react";
import {
  calculatePasswordStrength,
  PasswordStrengthResult,
  strengthLevels,
} from "../utils/calculate-password-strength";
import { cn } from "@/lib/utils";

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
  const [, startTransition] = useTransition();

  useEffect(() => {
    let isMounted = true;
    // Use a transition to avoid blocking UI while calculating
    startTransition(async () => {
      const result = await calculatePasswordStrength(password);

      if (isMounted) {
        setStrength(result);

        if (onStrengthChange) {
          onStrengthChange(result);
        }
      }
    });

    return () => {
      isMounted = false;
    };
  }, [password, onStrengthChange]);
  
  return (
    <div className={cn("space-y-2", className)}>
      {/* Background bar */}
      <div className="h-2 w-full bg-gray-200 rounded overflow-hidden relative">
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
