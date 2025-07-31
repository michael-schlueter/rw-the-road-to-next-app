"use server";

import {
  fromErrorToActionState,
  toActionState,
} from "@/components/form/utils/to-action-state";
import { getAuthOrRedirect } from "@/features/auth/queries/get-auth-or-redirect";
import { isOwner } from "@/features/auth/utils/is-owner";
import { ticketPath } from "@/paths";
import { revalidatePath } from "next/cache";
import * as ticketService from "@/features/ticket/service";
import * as commentData from "@/features/comment/data";

export async function deleteComment(id: string) {
  const { user } = await getAuthOrRedirect();

  const comment = await commentData.findCommentById(id);

  if (!comment || !isOwner(user, comment)) {
    return toActionState("ERROR", "Not authorized");
  }

  try {
    await commentData.deleteComment(id);

    await ticketService.disconnectReferencedTicketsViaComments(comment);
  } catch (error) {
    return fromErrorToActionState(error);
  }

  revalidatePath(ticketPath(comment.ticketId));

  return toActionState("SUCCESS", "Comment deleted");
}
