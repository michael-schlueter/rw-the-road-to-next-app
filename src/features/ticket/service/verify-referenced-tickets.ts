import { prisma } from "@/lib/prisma";
import { findTicketIdsFromText } from "@/utils/find-ids-from-text";

export async function verifyReferencedTickets(content: string) {
  const referencedTicketIds = findTicketIdsFromText("tickets", content);
  const invalidTicketIds = [];

  for (const referencedTicketId of referencedTicketIds) {
    const ticket = await prisma.ticket.findUnique({
      where: {
        id: referencedTicketId,
      },
    });

    if (!ticket) {
      invalidTicketIds.push(referencedTicketId);
    }
  }

  if (invalidTicketIds.length > 0)
    return null;

  return referencedTicketIds;
}
