import SearchInput from "@/components/search-input";
import getTickets from "../queries/get-tickets";
import TicketItem from "./ticket-item";
import { ParsedSearchParams } from "../search-params";
import Placeholder from "@/components/placeholder";
import SortSelect from "@/components/sort-select";

type TicketListProps = {
  userId?: string;
  searchParams: ParsedSearchParams;
};

export default async function TicketList({
  userId,
  searchParams,
}: TicketListProps) {
  const tickets = await getTickets(userId, searchParams);
  return (
    <div className="flex-1 flex flex-col items-center gap-y-4 animate-fade-from-top">
      <div className="w-full max-w-[420px] flex gap-x-2">
        <SearchInput placeholder="Search tickets ..." />
        <SortSelect
          options={[
            {
              sortKey: "createdAt",
              sortValue: "desc",
              label: "Newest"
            },
            {
              sortKey: "bounty",
              sortValue: "desc",
              label: "Bounty"
            },
          ]}
        />
      </div>
      {tickets.length ? (
        tickets.map((ticket) => <TicketItem key={ticket.id} ticket={ticket} />)
      ) : (
        <Placeholder label="No tickets found" />
      )}
    </div>
  );
}
