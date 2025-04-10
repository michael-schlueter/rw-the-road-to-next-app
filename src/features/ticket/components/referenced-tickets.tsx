import CardCompact from "@/components/card-compact";
import { getReferencedTickets } from "../queries/get-referenced-tickets";
import Link from "next/link";
import { LucideArrowUpRightFromSquare } from "lucide-react";
import { ticketPath } from "@/paths";

type ReferencedTicketsProps = {
  ticketId: string;
};

export default async function ReferencedTickets({
  ticketId,
}: ReferencedTicketsProps) {
  const referencedTickets = await getReferencedTickets(ticketId);

  if (!referencedTickets.length) return null;

  return (
    <CardCompact
      title="Referenced Tickets"
      description="Tickets that have been referenced in comments"
      content={
        <div className="mx-2 mb-4">
          {referencedTickets.map((referencedTicket) => (
            <div key={referencedTicket.id}>
              <Link
                className="flex gap-x-2 items-center text-sm"
                href={ticketPath(referencedTicket.id)}
              >
                <LucideArrowUpRightFromSquare className="h-4 w-4" />
                {referencedTicket.title}
              </Link>
            </div>
          ))}
        </div>
      }
    />
  );
}
