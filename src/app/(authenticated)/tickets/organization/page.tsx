import CardCompact from "@/components/card-compact";
import Heading from "@/components/heading";
import Spinner from "@/components/spinner";
import TicketList from "@/features/ticket/components/ticket-list";
import TicketUpsertForm from "@/features/ticket/components/ticket-upsert-form";
import { searchParamsCache } from "@/features/ticket/search-params";
import { SearchParams } from "nuqs/server";
import { Suspense } from "react";

type TicketsByOrganizationPageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function TicketsByOrganizationPage({
  searchParams,
}: TicketsByOrganizationPageProps) {
  return (
    <div className="flex-1 flex flex-col gap-y-8">
      <Heading
        title="Our Tickets"
        description="All tickets related to my organization"
      />

      <CardCompact
        title="Create Ticket"
        description="A new ticket will be created"
        className="w-full max-w-[420px] self-center"
        content={<TicketUpsertForm />}
      />

      <Suspense fallback={<Spinner />}>
        <TicketList
          byOrganization
          searchParams={searchParamsCache.parse(await searchParams)}
        />
      </Suspense>
    </div>
  );
}
