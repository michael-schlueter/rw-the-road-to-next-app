import { AttachmentEntity } from "@prisma/client";
import { AttachmentSubject, isComment, isTicket } from "../types";

export type Type = {
  entityid: string;
  entity: AttachmentEntity;
  organizationId: string;
  userId: string | null;
  ticketId: string;
  commentId: string | null;
};

export function fromTicket(ticket: AttachmentSubject | null) {
  if (!ticket) {
    return null;
  }

  if (isTicket(ticket)) {
    return {
      entity: "TICKET" as AttachmentEntity,
      entityId: ticket.id,
      organizationId: ticket.organizationId,
      userId: ticket.userId,
      ticketId: ticket.id,
      commentId: null,
    };
  }

  return null;
}

export function fromComment(comment: AttachmentSubject | null) {
  if (!comment) {
    return null;
  }

  if (isComment(comment)) {
    return {
      entity: "COMMENT" as AttachmentEntity,
      entityId: comment.id,
      organizationId: comment.ticket.organizationId,
      userId: comment.userId,
      ticketId: comment.ticket.id,
      commentId: comment.id,
    };
  }
}
