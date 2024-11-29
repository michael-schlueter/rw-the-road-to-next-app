import { prisma } from "@/lib/prisma";

export default async function getTicket(id: string) {
  return await prisma.ticket.findUnique({
    where: {
      id,
    },
  });
}
