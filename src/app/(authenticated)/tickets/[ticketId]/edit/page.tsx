import Breadcrumbs from "@/components/breadcrumbs";
import CardCompact from "@/components/card-compact";
import { Separator } from "@/components/ui/separator";
import { getActiveOrganization } from "@/features/organization/queries/get-active-organization";
import { getStripeCustomberByOrganization } from "@/features/stripe/queries/get-stripe-customer";
import { isActiveSubscription } from "@/features/stripe/utils/is-active-subscription";
import TicketUpsertForm from "@/features/ticket/components/ticket-upsert-form";
import getTicket from "@/features/ticket/queries/get-ticket";
import { homePath, ticketPath } from "@/paths";
import { notFound } from "next/navigation";

type TicketEditPageProps = {
  params: Promise<{
    ticketId: string;
  }>;
};

export default async function TicketEditPage({ params }: TicketEditPageProps) {
  const { ticketId } = await params;
  const ticket = await getTicket(ticketId);

  const isTicketFound = !!ticket;

  if (!isTicketFound || !ticket.isOwner) {
    notFound();
  }

    const activeOrganization = await getActiveOrganization();
    const stripeCustomer = await getStripeCustomberByOrganization(
      activeOrganization?.id
    );
    const hasActiveSubscription = await isActiveSubscription(stripeCustomer);

  return (
    <div className="flex-1 flex flex-col gap-y-8">
      <Breadcrumbs
        breadcrumbs={[
          { title: "Tickets", href: homePath() },
          { title: ticket.title, href: ticketPath(ticket.id) },
          { title: "Edit" },
        ]}
      />

      <Separator />

      <div className="flex-1 flex flex-col justify-center items-center">
        <CardCompact
          title="Edit Ticket"
          description="Edit an existing ticket"
          content={<TicketUpsertForm ticket={ticket} hasActiveSubscription={hasActiveSubscription} />}
          className="w-full max-w-[420px] animate-fade-from-top"
        />
      </div>
    </div>
  );
}
