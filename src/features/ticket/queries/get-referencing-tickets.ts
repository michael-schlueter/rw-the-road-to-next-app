import { prisma } from "@/lib/prisma";

export async function getReferencingTickets(ticketId: string) {
  const ticket = await prisma.ticket.findUnique({
    where: {
      id: ticketId,
    },
    select: {
      referencedTicket: true,
    },
  });

  // The referencedTicket can be null, and we want to return an array.
  if (!ticket?.referencedTicket) {
    return [];
  }

  return [ticket.referencedTicket];
}
