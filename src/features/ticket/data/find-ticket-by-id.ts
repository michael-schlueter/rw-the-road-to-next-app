"use server";

import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

type TicketWithInclude<T extends Prisma.TicketInclude> = Prisma.TicketGetPayload<{
  include: T;
}>;

export async function findTicketById<T extends Prisma.TicketInclude>(
  id: string,
  include?: T
): Promise<TicketWithInclude<T> | null> {
  const ticket = await prisma.ticket.findUnique({
    where: { id },
    include,
  });

  return ticket as TicketWithInclude<T> | null;
}
