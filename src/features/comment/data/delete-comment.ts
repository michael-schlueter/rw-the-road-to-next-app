"use server";

import { prisma } from "@/lib/prisma";

export async function deleteComment(id: string) {
  return prisma.comment.delete({
    where: {
      id,
    },
  });
}
