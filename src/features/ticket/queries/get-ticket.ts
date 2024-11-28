import { initialTickets } from "@/data";
import { Ticket } from "../types";

export default async function getTicket(id: string): Promise<Ticket | null> {
  const maybeTicket = initialTickets.find((ticket) => ticket.id === id);

  await new Promise((resolve) => setTimeout(resolve, 2000));

  return new Promise((resolve) => resolve(maybeTicket || null));
}
