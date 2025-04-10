import { prisma } from "@/lib/prisma";

export async function getReferencedTickets(ticketId: string) {
    const ticket =  await prisma.ticket.findUnique({
        where: {
            id: ticketId,
        },
        include: {
            referencedTickets: true,
        }
    })

    return ticket?.referencedTickets ?? [];
}