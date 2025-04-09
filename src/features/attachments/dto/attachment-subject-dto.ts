import { AttachmentEntity } from "@prisma/client";
import { AttachmentSubject, isComment, isTicket } from "../types";

// export type Type = {
//   entityId: string;
//   entity: AttachmentEntity;
//   organizationId: string;
//   userId: string | null;
//   ticketId: string;
//   commentId: string | null;
// };

// export function fromTicket(ticket: AttachmentSubject | null) {
//   if (!ticket) {
//     return null;
//   }

//   if (isTicket(ticket)) {
//     return {
//       entity: "TICKET" as AttachmentEntity,
//       entityId: ticket.id,
//       organizationId: ticket.organizationId,
//       userId: ticket.userId,
//       ticketId: ticket.id,
//       commentId: null,
//     };
//   }

//   return null;
// }

// export function fromComment(comment: AttachmentSubject | null) {
//   if (!comment) {
//     return null;
//   }

//   if (isComment(comment)) {
//     return {
//       entity: "COMMENT" as AttachmentEntity,
//       entityId: comment.id,
//       organizationId: comment.ticket.organizationId,
//       userId: comment.userId,
//       ticketId: comment.ticket.id,
//       commentId: comment.id,
//     };
//   }
// }

export class AttachmentSubjectDTO {
  entity: AttachmentEntity;
  entityId: string;
  organizationId: string;
  userId: string;
  ticketId: string;
  commentId: string | null;

  constructor(
    entity: AttachmentEntity,
    entityId: string,
    organizationId: string,
    userId: string,
    ticketId: string,
    commentId: string | null
  ) {
    this.entity = entity;
    this.entityId = entityId;
    this.organizationId = organizationId;
    this.userId = userId;
    this.ticketId = ticketId;
    this.commentId = commentId;
  }

  static fromTicket(ticket: AttachmentSubject | null) {
    if (!ticket || !isTicket(ticket)) {
      return null;
    }

    return new AttachmentSubjectDTO(
      "TICKET",
      ticket.id,
      ticket.organizationId,
      ticket.userId,
      ticket.id,
      null
    );
  }

  static fromComment(comment: AttachmentSubject | null, userId: string) {
    if (!comment || !isComment(comment)) {
      return null;
    }

    return new AttachmentSubjectDTO(
      "COMMENT",
      comment.id,
      comment.ticket.organizationId,
      userId,
      comment.ticket.id,
      comment.id
    );
  }
}
