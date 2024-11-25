type TicketPageProps = {
  params: Promise<{
    ticketId: string;
  }>;
};

export default async function TicketPage({ params }: TicketPageProps) {
  const { ticketId } = await params;
  return <h2 className="text-lg">TicketPage: {ticketId}</h2>;
}
