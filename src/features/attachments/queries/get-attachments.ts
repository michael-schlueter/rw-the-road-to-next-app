import { prisma } from "@/lib/prisma";

export async function getAttachments(ticketId: string) {
  return await prisma.attachment.findMany({
    where: {
      ticketId,
    },
  });
}
