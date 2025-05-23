import Breadcrumbs from "@/components/breadcrumbs";
import { Separator } from "@/components/ui/separator";
import Attachments from "@/features/attachments/components/attachments";
import Comments from "@/features/comment/components/comments/comments";
import { getComments } from "@/features/comment/queries/get-comments";
import ReferencedTickets from "@/features/ticket/components/referenced-tickets";
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
  const ticketPromise = await getTicket(ticketId);
  const commentsPromise = await getComments(ticketId);

  const [ticket, paginatedComments] = await Promise.all([
    ticketPromise,
    commentsPromise,
  ]);

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
        <TicketItem
          ticket={ticket}
          isDetail
          attachments={
            <Attachments
              entityId={ticket.id}
              entity="TICKET"
              isOwner={ticket.isOwner}
            />
          }
          referencedTickets={<ReferencedTickets ticketId={ticket.id} />}
          comments={
            <Comments
              ticketId={ticket.id}
              paginatedComments={paginatedComments}
            />
          }
        />
      </div>
    </div>
  );
}
