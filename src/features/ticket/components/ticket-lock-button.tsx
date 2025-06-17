"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { pricingPath } from "@/paths";
import { LucideLockKeyhole } from "lucide-react";
import Link from "next/link";

type TicketLockButtonProps = {
  tooltipText: string;
};

export default function TicketLockButton({
  tooltipText,
}: TicketLockButtonProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button asChild size="icon" variant="outline">
            <Link prefetch href={pricingPath()} className="text-sm underline">
              <LucideLockKeyhole className="w-4 h-4" />
            </Link>
          </Button>
        </TooltipTrigger>
        <TooltipContent>{tooltipText}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
