"use server";

import { prisma } from "@/lib/prisma";

type CreateAttachmentArgs = {
  name: string;
  type: string;
} & (
  | { entity: "TICKET"; ticketId: string; commentId?: never }
  | { entity: "COMMENT"; commentId: string; ticketId?: never }
);

export async function createAttachment(args: CreateAttachmentArgs) {
  const { name, type, entity } = args;
  return await prisma.attachment.create({
    data: {
      name,
      ticketId: entity === "TICKET" ? args.ticketId : undefined,
      commentId: entity === "COMMENT" ? args.commentId : undefined,
      entity,
      type,
    },
  });
}
