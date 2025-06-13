import CardCompact from "@/components/card-compact";
import Heading from "@/components/heading";
import Spinner from "@/components/spinner";
import { getAuth } from "@/features/auth/queries/get-auth";
import { getActiveOrganization } from "@/features/organization/queries/get-active-organization";
import { getStripeCustomberByOrganization } from "@/features/stripe/queries/get-stripe-customer";
import { isActiveSubscription } from "@/features/stripe/utils/is-active-subscription";
import TicketList from "@/features/ticket/components/ticket-list";
import TicketUpsertForm from "@/features/ticket/components/ticket-upsert-form";
import { searchParamsCache } from "@/features/ticket/search-params";
import { SearchParams } from "nuqs/server";
import { Suspense } from "react";

type TicketsPageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function TicketsPage({ searchParams }: TicketsPageProps) {
  const { user } = await getAuth();
  const activeOrganization = await getActiveOrganization();
  const stripeCustomer = await getStripeCustomberByOrganization(
    activeOrganization?.id
  );
  const hasActiveSubscription = await isActiveSubscription(stripeCustomer);

  return (
    <div className="flex-1 flex flex-col gap-y-8">
      <Heading title="Tickets" description="All your tickets at one place" />
      <CardCompact
        title="Create Ticket"
        description="A new ticket will be created"
        content={<TicketUpsertForm hasActiveSubscription={hasActiveSubscription} />}
        className="w-full max-w-[420px] self-center"
      />

      <Suspense fallback={<Spinner />}>
        <TicketList
          userId={user?.id}
          searchParams={searchParamsCache.parse(await searchParams)}
        />
      </Suspense>
    </div>
  );
}
