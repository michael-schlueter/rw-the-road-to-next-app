import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ticketPath } from "@/paths";
import Link from "next/link";
import { Ticket } from "../types";
import { TICKET_ICONS } from "../constants";
import { Button } from "@/components/ui/button";
import { LucideArrowUpRightFromSquare } from "lucide-react";

type TicketItemProps = {
  ticket: Ticket;
};

export default function TicketItem({ ticket }: TicketItemProps) {
  const DetailButton = () => {
    return (
      <Button asChild size="icon" variant="outline">
        <Link href={ticketPath(ticket.id)} className="text-sm underline">
          <LucideArrowUpRightFromSquare className="w-4 h-4" />
        </Link>
      </Button>
    );
  };

  return (
    <div className="w-full max-w-[420px] flex gap-x-1">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex gap-x-2">
            <span>{TICKET_ICONS[ticket.status]}</span>
            <span className="truncate">{ticket.title}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <span className="line-clamp-3 whitespace-break-spaces">
            {ticket.content}
          </span>
        </CardContent>
      </Card>
      <div className="flex flex-col gap-y-1">
        <DetailButton />
      </div>
    </div>
  );
}
