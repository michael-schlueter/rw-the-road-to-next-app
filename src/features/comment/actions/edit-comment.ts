"use server";

import {
  ActionState,
  fromErrorToActionState,
  toActionState,
} from "@/components/form/utils/to-action-state";
import { getAuthOrRedirect } from "@/features/auth/queries/get-auth-or-redirect";
import { prisma } from "@/lib/prisma";
import { ticketPath } from "@/paths";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import getComment from "../queries/get-comment";
import { isOwner } from "@/features/auth/utils/is-owner";
import { redirect } from "next/navigation";
import { setCookieByKey } from "@/actions/cookies";

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

    await prisma.comment.update({
      where: {
        id: commentId,
      },
      data: {
        content: data.content,
      },
      include: {
        user: true,
      },
    });
  } catch (error) {
    return fromErrorToActionState(error, formData);
  }

  revalidatePath(ticketPath(ticketId));

  await setCookieByKey("toast", "Comment updated");
  redirect(ticketPath(ticketId));
}
