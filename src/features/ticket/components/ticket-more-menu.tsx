"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Ticket, TicketStatus } from "@prisma/client";
import { LucideTrash } from "lucide-react";
import { TICKET_STATUS_LABELS } from "../constants";
import { updateTicketStatus } from "../actions/update-ticket-status";
import { toast } from "sonner";

type TicketMoreMenuProps = {
  ticket: Ticket;
  trigger: React.ReactNode;
};

export default function TicketMoreMenu({
  ticket,
  trigger,
}: TicketMoreMenuProps) {
  const deleteButton = (
    <DropdownMenuItem>
      <LucideTrash className="h-4 w-4" />
      <span>Delete</span>
    </DropdownMenuItem>
  );

  const handleTicketStatusUpdate = async (value: string) => {
    const result = await updateTicketStatus(ticket.id, value as TicketStatus);

    if (result.status === "ERROR") {
      toast.error(result.message);
    } else if (result.status === "SUCCESS") {
      toast.success(result.message);
    }
  };

  const ticketStatusRadioGroupItems = (
    <DropdownMenuRadioGroup
      value={ticket.status}
      onValueChange={handleTicketStatusUpdate}
    >
      {(Object.keys(TICKET_STATUS_LABELS) as Array<TicketStatus>).map((key) => (
        <DropdownMenuRadioItem key={key} value={key}>
          {TICKET_STATUS_LABELS[key]}
        </DropdownMenuRadioItem>
      ))}
    </DropdownMenuRadioGroup>
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" side="right">
        {ticketStatusRadioGroupItems}
        <DropdownMenuSeparator />
        {deleteButton}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
