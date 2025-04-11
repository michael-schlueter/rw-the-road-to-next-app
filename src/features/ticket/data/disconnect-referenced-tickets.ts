import { prisma } from "@/lib/prisma";

export async function disconnectReferencedTickets(
  ticketId: string,
  ticketsId: string[]
) {
  await prisma.ticket.update({
    where: {
      id: ticketId,
    },
    data: {
      referencedTickets: {
        disconnect: ticketsId.map((id) => ({
          id,
        })),
      },
    },
  });
}
