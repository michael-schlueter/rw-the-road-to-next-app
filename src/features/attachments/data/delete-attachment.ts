"use server";

import { prisma } from "@/lib/prisma";

export async function deleteAttachment(id: string) {
  return prisma.attachment.delete({
    where: {
      id,
    },
  });
}
