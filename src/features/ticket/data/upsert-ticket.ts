"use server";

import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function upsertTicket(
  id: string | undefined,
  ticket: Omit<Prisma.TicketUncheckedCreateInput, "organizationId">,
  organizationId: string
) {
  return await prisma.ticket.upsert({
    where: {
      id: id || "",
    },
    update: ticket,
    create: { ...ticket, organizationId },
  });
}
