import { prisma } from "@/lib/prisma";

export async function findTicketById(id: string) {
  return prisma.ticket.findUnique({
    where: { id },
  });
}
