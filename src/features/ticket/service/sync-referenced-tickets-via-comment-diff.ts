import { findTicketIdsFromText } from "@/utils/find-ids-from-text";
import { verifyReferencedTickets } from "./verify-referenced-tickets";
import * as ticketData from "@/features/ticket/data";
import * as ticketService from "@/features/ticket/service";

export async function syncReferencedTicketsViaCommentDiff(
  ticketId: string,
  commentId: string,
  oldContent: string,
  newContent: string
) {
  // Extract ticketIds from old comment content
  const oldReferencedTicketIds = findTicketIdsFromText("tickets", oldContent);

  // Verify ticketIds from new comment content exist
  const verifiedNewReferencedTicketIds =
    await verifyReferencedTickets(newContent);

  if (!verifiedNewReferencedTicketIds) return;

  // Determine tickets to disconnect (tickets were in old comment content but are not in new comment content)
  const oldReferencedTicketIdsToDisconnect = oldReferencedTicketIds.filter(
    (oldReferencedTicketId) => {
      return !verifiedNewReferencedTicketIds.includes(oldReferencedTicketId);
    }
  );

  // Check if ticket to disconnect is mentioned in another comment related to the ticket (skip disconnect)
  if (oldReferencedTicketIdsToDisconnect.length > 0) {
    const ticketIdsToRemove =
      await ticketService.findTicketIdsNotReferencedInOtherComments(
        ticketId,
        commentId,
        oldReferencedTicketIdsToDisconnect
      );

    // Disconnect ticket(s)
    await ticketData.disconnectReferencedTickets(ticketId, ticketIdsToRemove);
  }

  // Determine tickets to connect (tickets are in new comment, but were not in old comment content)
  const newReferencedTicketIdsToConnect = verifiedNewReferencedTicketIds.filter(
    (verifiedNewReferencedTicketId) => {
      return !oldReferencedTicketIds.includes(verifiedNewReferencedTicketId);
    }
  );

  // Connect ticket(s)
  if (newReferencedTicketIdsToConnect.length > 0) {
    await ticketData.connectReferencedTickets(
      ticketId,
      newReferencedTicketIdsToConnect
    );
  }
}
