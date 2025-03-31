"use server";

import { setCookieByKey } from "@/actions/cookies";
import {
  fromErrorToActionState,
  toActionState,
} from "@/components/form/utils/to-action-state";
import { getAuthOrRedirect } from "@/features/auth/queries/get-auth-or-redirect";
import { isOwner } from "@/features/auth/utils/is-owner";
import { prisma } from "@/lib/prisma";
import { ticketsPath } from "@/paths";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getTicketPermissions } from "../permissions/get-ticket-permission";
import { inngest } from "@/lib/inngest";

export async function deleteTicket(id: string) {
  const { user } = await getAuthOrRedirect();

  try {
    const ticket = await prisma.ticket.findUnique({
      where: {
        id,
      },
      include: {
        attachments: true,
      },
    });

    if (!ticket || !isOwner(user, ticket)) {
      return toActionState("ERROR", "Not authorized");
    }

    const permissions = await getTicketPermissions({
      organizationId: ticket.organizationId,
      userId: user.id,
    });

    if (!permissions.canDeleteTicket) {
      return toActionState("ERROR", "Not authorized");
    }

    await prisma.ticket.delete({
      where: {
        id,
      },
    });

    await inngest.send({
      name: "app/ticket.deleted",
      data: {
        ticketId: ticket.id,
        organizationId: ticket.organizationId,
        attachments: ticket.attachments.map((attachment) => ({
          fileName: attachment.name,
          attachmentId: attachment.id,
        })),
      },
    });
  } catch (error) {
    return fromErrorToActionState(error);
  }

  revalidatePath(ticketsPath());
  await setCookieByKey("toast", "Ticket deleted");
  redirect(ticketsPath());
}
