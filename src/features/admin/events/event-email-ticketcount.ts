import { inngest } from "@/lib/inngest";
import { prisma } from "@/lib/prisma";
import sendEmailTicketCount from "../emails/send-email-ticketcount";

export const emailTicketCountFunction = inngest.createFunction(
  { id: "email-ticket-count" },
  { cron: "0 9 1 1 *" },
  async () => {
    // Get count of tickets created in the last 7 days
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);

    const ticketCount = await prisma.ticket.count({
      where: {
        createdAt: {
          gte: startDate,
        },
      },
    });

    // Send email with ticket count
    const result = await sendEmailTicketCount(ticketCount.toString());

    if (result.error) {
      throw new Error(`${result.error.name}: ${result.error.message}`);
    }

    return { body: result };
  }
);
