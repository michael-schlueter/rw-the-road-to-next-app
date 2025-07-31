import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export type FindCommentOptions = {
  includeTicket?: boolean;
};

export async function findCommentById(
  id: string,
  options: FindCommentOptions = {}
) {
  const { includeTicket } = options;

  const include: Prisma.CommentInclude = {};

  if (includeTicket) {
    include.ticket = true;
  }

  return prisma.comment.findUnique({
    where: {
      id,
    },
    include: Object.keys(include).length > 0 ? include : undefined,
  });
}
