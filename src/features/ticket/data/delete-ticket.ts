import { prisma } from "@/lib/prisma";

export async function deleteTicket(id: string) {
    await prisma.ticket.delete({
          where: {
            id,
          },
        });
}