import { useQuery } from "@tanstack/react-query";
import * as ticketData from "@/features/ticket/data";
import Link from "next/link";

type TicketLinkProps = {
  ticketId: string;
};

export default function TicketLink({ ticketId }: TicketLinkProps) {
  const { data: ticket, isLoading } = useQuery({
    queryKey: ["tickets", ticketId],
    queryFn: () => ticketData.findTicketById(ticketId),
  });

  const href = `/tickets/${ticketId}`;

  if (isLoading) {
    return (
      <Link href={href} className="underline">
        Ticket: #{ticketId.substring(0, 6)}...
      </Link>
    );
  }

  if (!ticket) {
    return (
      <Link href={href} className="underline">
        Ticket not found
      </Link>
    );
  }
  return (
    <Link href={href} className="underline">
      {ticket.title}
    </Link>
  );
}
