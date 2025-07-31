import CardCompact from "@/components/card-compact";
import Link from "next/link";
import { LucideArrowUpRightFromSquare } from "lucide-react";
import { ticketPath } from "@/paths";
import { getReferencingTickets } from "../queries/get-referencing-tickets";

type ReferencingTicketsProps = {
  ticketId: string;
};

export default async function ReferencingTickets({
  ticketId,
}: ReferencingTicketsProps) {
  const referencingTickets = await getReferencingTickets(ticketId);

  if (!referencingTickets.length) return null;

  return (
    <CardCompact
      title="Referencing Tickets"
      description="Tickets that are referencing this ticket"
      content={
        <div className="mx-2 mb-4">
          {referencingTickets.map((referencingTicket) => (
            <div key={referencingTicket.id}>
              <Link
                className="flex gap-x-2 items-center text-sm"
                href={ticketPath(referencingTicket.id)}
              >
                <LucideArrowUpRightFromSquare className="h-4 w-4" />
                {referencingTicket.title}
              </Link>
            </div>
          ))}
        </div>
      }
    />
  );
}
