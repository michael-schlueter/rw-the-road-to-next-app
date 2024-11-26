import { initialTickets } from "@/data";
import { ticketPath } from "@/paths";
import Link from "next/link";

export default function TicketsPage() {
  return (
    <div>
      {initialTickets.map((ticket) => (
        <div key={ticket.id}>
          <h2 className="text-lg">{ticket.title}</h2>

          <Link href={ticketPath(ticket.id)} className="text-sm underline">View</Link>
        </div>
      ))}
    </div>
  );
}
