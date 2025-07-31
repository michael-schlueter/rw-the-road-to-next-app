import { findTicketIdsFromText } from "@/utils/find-ids-from-text";
import { Comment } from "@prisma/client";
import * as ticketData from "@/features/ticket/data";
import * as ticketService from "@/features/ticket/service";

export async function disconnectReferencedTicketsViaComments(comment: Comment) {
  const ticketIds = findTicketIdsFromText("tickets", comment.content);

  if (!ticketIds.length) return;

  const ticketIdsToRemove =
    await ticketService.findTicketIdsNotReferencedInOtherComments(
      comment.ticketId,
      comment.id,
      ticketIds
    );

  await ticketData.disconnectReferencedTickets(
    comment.ticketId,
    ticketIdsToRemove
  );
}
