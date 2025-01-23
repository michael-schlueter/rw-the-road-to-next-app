import CardCompact from "@/components/card-compact";
import Heading from "@/components/heading";
import Spinner from "@/components/spinner";
import { getAuth } from "@/features/auth/queries/get-auth";
import TicketList from "@/features/ticket/components/ticket-list";
import TicketUpsertForm from "@/features/ticket/components/ticket-upsert-form";
import { SearchParams } from "@/features/ticket/search-params";
import { Suspense } from "react";

type TicketsPageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function TicketsPage({ searchParams }: TicketsPageProps) {
  const { user } = await getAuth();

  return (
    <div className="flex-1 flex flex-col gap-y-8">
      <Heading title="Tickets" description="All your tickets at one place" />
      <CardCompact
        title="Create Ticket"
        description="A new ticket will be created"
        content={<TicketUpsertForm />}
        className="w-full max-w-[420px] self-center"
      />

      <Suspense fallback={<Spinner />}>
        <TicketList userId={user?.id} searchParams={await searchParams} />
      </Suspense>
    </div>
  );
}
