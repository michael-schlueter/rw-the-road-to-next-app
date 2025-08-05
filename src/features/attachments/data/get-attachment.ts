"use server";

import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export type GetAttachmentOptions = {
  includeTicket?: boolean;
  includeComment?: boolean;
  includeCommentTicket?: boolean;
};

export async function getAttachment(
  id: string,
  options: GetAttachmentOptions = {}
) {
  const { includeTicket, includeComment, includeCommentTicket } = options;

  const include: Prisma.AttachmentInclude = {};

  if (includeTicket) {
    include.ticket = true;
  }

  if (includeComment) {
    include.comment = includeCommentTicket
      ? { include: { ticket: true } }
      : true;
  }

  return await prisma.attachment.findUnique({
    where: { id },
    include: Object.keys(include).length > 0 ? include : undefined,
  });
}
