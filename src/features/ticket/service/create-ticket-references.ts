import * as ticketService from "@/features/ticket/service";
import * as ticketData from "@/features/ticket/data"

export async function createTicketReferences(ticketId: string, content: string) {
    const validReferencedTicketIds = await ticketService.verifyReferencedTickets(content);

    if (!validReferencedTicketIds) return false;

    if (validReferencedTicketIds.length > 0) {
        await ticketData.connectReferencedTickets(ticketId, validReferencedTicketIds);
    }

    return true;
}