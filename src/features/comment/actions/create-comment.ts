"use server";

import {
  ActionState,
  fromErrorToActionState,
  toActionState,
} from "@/components/form/utils/to-action-state";
import { filesSchema } from "@/features/attachments/schema/files";
import { getAuthOrRedirect } from "@/features/auth/queries/get-auth-or-redirect";
import { ticketPath } from "@/paths";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import * as attachmentService from "@/features/attachments/services";
import * as ticketService from "@/features/ticket/service";
import * as commentData from "@/features/comment/data";
import { AttachmentSubjectDTO } from "@/features/attachments/dto/attachment-subject-dto";

const createCommentSchema = z.object({
  content: z.string().min(1).max(1024),
  files: filesSchema,
});

export async function createComment(
  ticketId: string,
  _actionState: ActionState,
  formData: FormData
) {
  const { user } = await getAuthOrRedirect();

  let comment;

  try {
    const { content, files } = createCommentSchema.parse({
      content: formData.get("content"),
      files: formData.getAll("files"),
    });

    // Create comment with potential attachments
    comment = await commentData.createComment({
      userId: user.id,
      ticketId,
      content,
      options: {
        includeUser: true,
        includeTicket: true,
      },
    });

    const subject = AttachmentSubjectDTO.fromComment(comment, user.id);

    if (!subject) {
      return toActionState("ERROR", "Comment not created");
    }

    await attachmentService.createAttachments({
      subject: subject,
      entity: "COMMENT",
      entityId: comment.id,
      files,
    });

    // Create ticket references from content of comment
    const referencesCreated = ticketService.createTicketReferences(
      ticketId,
      content
    );

    if (!referencesCreated) {
      return toActionState(
        "ERROR",
        "One or more referenced ticket(s) do not correspond to existing ticket(s)"
      );
    }
  } catch (error) {
    return fromErrorToActionState(error);
  }

  revalidatePath(ticketPath(ticketId));
  return toActionState("SUCCESS", "Comment created", undefined, {
    ...comment,
    isOwner: true,
  });
}
