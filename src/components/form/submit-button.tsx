"use client";

import { LucideLoaderCircle } from "lucide-react";
import { useFormStatus } from "react-dom";
import { Button } from "../ui/button";
import clsx from "clsx";
import { cloneElement } from "react";

type SubmitButtonProps = {
  label?: string;
  icon?: React.ReactElement;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
};

export default function SubmitButton({
  label,
  icon,
  variant = "default",
  size = "default",
}: SubmitButtonProps) {
  const { pending } = useFormStatus();
  return (
    <Button disabled={pending} type="submit" variant={variant} size={size}>
      {pending && (
        <LucideLoaderCircle
          className={clsx("h-4 w-4 animate-spin", {
            "mr-2": !!label,
          })}
        />
      )}
      {label}
      {pending ? null : icon ? (
        <span
          className={clsx({
            "ml-2": !!label,
          })}
        >
          {cloneElement(icon, {
            className: "w-4 h-4",
          })}
        </span>
      ) : null}
    </Button>
  );
}
