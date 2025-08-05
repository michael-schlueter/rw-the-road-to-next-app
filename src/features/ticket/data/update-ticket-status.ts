"use server";

import { prisma } from "@/lib/prisma";
import { TicketStatus } from "@prisma/client";

export async function updateTicketStatus(
  ticketId: string,
  status: TicketStatus
) {
  await prisma.ticket.update({
    where: {
      id: ticketId,
    },
    data: {
      status,
    },
  });
}
