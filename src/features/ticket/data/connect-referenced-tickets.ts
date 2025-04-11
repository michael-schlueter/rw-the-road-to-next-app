import { prisma } from "@/lib/prisma";

export async function connectReferencedTickets(
  ticketId: string,
  ticketIds: string[]
) {
  await prisma.ticket.update({
    where: {
      id: ticketId,
    },
    data: {
      referencedTickets: {
        connect: ticketIds.map((id) => ({
          id,
        })),
      },
    },
  });
}
