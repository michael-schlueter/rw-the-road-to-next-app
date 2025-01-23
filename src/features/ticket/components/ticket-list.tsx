import SearchInput from "@/components/search-input";
import getTickets from "../queries/get-tickets";
import TicketItem from "./ticket-item";
import { SearchParams } from "../search-params";
import Placeholder from "@/components/placeholder";

type TicketListProps = {
  userId?: string;
  searchParams: SearchParams;
};

export default async function TicketList({
  userId,
  searchParams,
}: TicketListProps) {
  const tickets = await getTickets(userId, searchParams);
  return (
    <div className="flex-1 flex flex-col items-center gap-y-4 animate-fade-from-top">
      <div className="w-full max-w-[420px]">
        <SearchInput placeholder="Search tickets ..." />
      </div>
      {tickets.length ? (
        tickets.map((ticket) => <TicketItem key={ticket.id} ticket={ticket} />)
      ) : (
        <Placeholder label="No tickets found" />
      )}
    </div>
  );
}
