"use server";

import { prisma } from "@/lib/prisma";

export async function updateCommnentContent(id: string, content: string) {
  return await prisma.comment.update({
    where: {
      id,
    },
    data: {
      content,
    },
    include: {
      user: true,
    },
  });
}
