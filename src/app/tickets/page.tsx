"use client";

import Heading from "@/components/heading";
import TicketItem from "@/features/ticket/components/ticket-item";
import { useEffect, useState } from "react";
import { Ticket } from "@/features/ticket/types";
import getTickets from "@/features/ticket/queries/get-tickets";

export default function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);

  useEffect(() => {
    async function fetchTickets() {
      const result = await getTickets();
      setTickets(result);
    }

    fetchTickets();
  }, []);
  return (
    <div className="flex-1 flex flex-col gap-y-8">
      <Heading title="Tickets" description="All your tickets at one place" />

      <div className="flex-1 flex flex-col items-center gap-y-4 animate-fade-from-top">
        {tickets.map((ticket) => (
          <TicketItem key={ticket.id} ticket={ticket} />
        ))}
      </div>
    </div>
  );
}
