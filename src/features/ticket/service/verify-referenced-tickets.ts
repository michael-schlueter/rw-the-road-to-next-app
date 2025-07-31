import * as ticketData from "@/features/ticket/data";
import { findTicketIdsFromText } from "@/utils/find-ids-from-text";

export async function verifyReferencedTickets(content: string) {
  const referencedTicketIds = findTicketIdsFromText("tickets", content);
  const invalidTicketIds = [];

  for (const referencedTicketId of referencedTicketIds) {
    const ticket = await ticketData.findTicketById(referencedTicketId);

    if (!ticket) {
      invalidTicketIds.push(referencedTicketId);
    }
  }

  if (invalidTicketIds.length > 0) return null;

  return referencedTicketIds;
}
