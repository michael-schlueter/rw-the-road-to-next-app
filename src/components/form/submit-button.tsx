"use client";

import { LucideLoaderCircle } from "lucide-react";
import { useFormStatus } from "react-dom";
import { Button, ButtonProps } from "../ui/button";
import { cloneElement } from "react";
import type { ReactElement } from "react";
import { cn } from "@/lib/utils";

type SubmitButtonProps = {
  label?: string;
  icon?: ReactElement<{ className?: string }>;
  variant?: ButtonProps["variant"];
  size?: ButtonProps["size"];
  disabled?: boolean;
};

export default function SubmitButton({
  label,
  icon,
  variant = "default",
  size = "default",
  disabled = false,
}: SubmitButtonProps) {
  const { pending } = useFormStatus();
  const isDisabled = pending || disabled;
  return (
    <Button disabled={isDisabled} type="submit" variant={variant} size={size}>
      {pending ? (
        <LucideLoaderCircle className="h-4 w-4 animate-spin" />
      ) : icon ? (
        <>
          {cloneElement(icon, {
            className: cn("w-4 h-4", icon.props.className),
          })}
        </>
      ) : null}
      {label}
    </Button>
  );
}
