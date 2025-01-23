import Breadcrumbs from "@/components/breadcrumbs";
import { Separator } from "@/components/ui/separator";
import TicketItem from "@/features/ticket/components/ticket-item";
import getTicket from "@/features/ticket/queries/get-ticket";
import { homePath } from "@/paths";

import { notFound } from "next/navigation";

type TicketPageProps = {
  params: Promise<{
    ticketId: string;
  }>;
};

export default async function TicketPage({ params }: TicketPageProps) {
  const { ticketId } = await params;
  const ticket = await getTicket(ticketId);

  if (!ticket) {
    return notFound();
  }

  return (
    <div className="flex-1 flex flex-col gap-y-8">
      <Breadcrumbs
        breadcrumbs={[
          { title: "Tickets", href: homePath() },
          { title: ticket.title },
        ]}
      />

      <Separator />

      <div className="flex justify-center">
        <TicketItem ticket={ticket} isDetail />
      </div>
    </div>
  );
}
