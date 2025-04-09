import { prisma } from "@/lib/prisma";

export async function getAttachment(id: string) {
  return await prisma.attachment.findUnique({
    where: {
      id,
    },
    include: {
      ticket: true,
      comment: {
        include: {
          ticket: true,
        },
      },
    },
  });
}
