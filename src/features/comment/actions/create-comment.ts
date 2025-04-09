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
import * as commentData from "@/features/comment/data";
import * as attachmentSubjectDTO from "@/features/attachments/dto";

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

    comment = await commentData.createComment({
      userId: user.id,
      ticketId,
      content,
      options: {
        includeUser: true,
        includeTicket: true,
      },
    });

    const subject = attachmentSubjectDTO.fromComment(comment);

    if (!subject) {
      return toActionState("ERROR", "Comment not created");
    }

    await attachmentService.createAttachments({
      subject: subject,
      entity: "COMMENT",
      entityId: comment.id,
      files,
    });
  } catch (error) {
    return fromErrorToActionState(error);
  }

  revalidatePath(ticketPath(ticketId));
  return toActionState("SUCCESS", "Comment created", undefined, {
    ...comment,
    isOwner: true,
  });
}
