"use server";

import {
  ActionState,
  fromErrorToActionState,
  toActionState,
} from "@/components/form/utils/to-action-state";
import { getAuthOrRedirect } from "@/features/auth/queries/get-auth-or-redirect";
import { ticketPath } from "@/paths";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import getComment from "../queries/get-comment";
import { isOwner } from "@/features/auth/utils/is-owner";
import * as ticketService from "@/features/ticket/service";
import * as commentData from "@/features/comment/data";

const editCommentSchema = z.object({
  content: z.string().min(1).max(1024),
});

export async function editComment(
  commentId: string,
  ticketId: string,
  _actionState: ActionState,
  formData: FormData
) {
  const { user } = await getAuthOrRedirect();

  try {
    const comment = await getComment(commentId);

    if (!comment || !isOwner(user, comment)) {
      return toActionState("ERROR", "Not authorized");
    }

    const data = editCommentSchema.parse(Object.fromEntries(formData));

    const isSyncSuccessful =
      await ticketService.syncReferencedTicketsViaCommentDiff(
        ticketId,
        commentId,
        comment.content,
        data.content
      );

    if (!isSyncSuccessful) {
      return toActionState(
        "ERROR",
        "One or more referenced tickets are invalid."
      );
    }

    await commentData.updateCommnentContent(commentId, data.content);
  } catch (error) {
    return fromErrorToActionState(error, formData);
  }

  revalidatePath(ticketPath(ticketId));

  return toActionState("SUCCESS", "Comment updated");
}
