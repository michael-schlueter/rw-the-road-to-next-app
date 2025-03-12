"use client";

import { LucideLoaderCircle } from "lucide-react";
import { useFormStatus } from "react-dom";
import { Button, ButtonProps } from "../ui/button";
import { cloneElement } from "react";

type SubmitButtonProps = {
  label?: string;
  icon?: React.ReactElement;
  variant?: ButtonProps["variant"];
  size?: ButtonProps["size"];
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
      {pending ? (
        <LucideLoaderCircle className="h-4 w-4 animate-spin" />
      ) : icon ? (
        <>
          {cloneElement(icon, {
            className: "w-4 h-4",
          })}
        </>
      ) : null}
      {label}
    </Button>
  );
}
