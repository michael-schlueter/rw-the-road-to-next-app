"use server";

import { prisma } from "@/lib/prisma";
import { Comment, Prisma, Ticket } from "@prisma/client";

export type FindCommentOptions = {
  includeTicket?: boolean;
};

// Overload signatures
export async function findCommentById(
  id: string,
  options: { includeTicket: true }
): Promise<(Comment & { ticket: Ticket }) | null>;

export async function findCommentById(
  id: string,
  options?: { includeTicket?: false }
): Promise<Comment | null>;

export async function findCommentById(
  id: string,
  options?: FindCommentOptions
) {
  const include =
    options?.includeTicket === true
      ? ({ ticket: true } satisfies Prisma.CommentInclude)
      : undefined;

  return prisma.comment.findUnique({
    where: {
      id,
    },
    include,
  });
}
