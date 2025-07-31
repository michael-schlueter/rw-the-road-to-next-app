import { prisma } from "@/lib/prisma";
import { findTicketIdsFromText } from "@/utils/find-ids-from-text";

export async function findTicketIdsNotReferencedInOtherComments(
  ticketId: string,
  commentId: string,
  ticketIdsToRemove: string[]
) {
  const comments = await prisma.comment.findMany({
    where: {
      ticketId,
      id: {
        not: commentId,
      },
    },
  });

  const allOtherTicketIds = findTicketIdsFromText(
    "tickets",
    comments.map((comment) => comment.content).join(" ")
  );

  return ticketIdsToRemove.filter(
    (ticketIdToRemove: string) => !allOtherTicketIds.includes(ticketIdToRemove)
  );
}
