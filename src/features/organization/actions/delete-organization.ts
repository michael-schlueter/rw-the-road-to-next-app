"use server";

import { getOrganizationsByUser } from "../queries/get-organizations-by-user";
import {
  fromErrorToActionState,
  toActionState,
} from "@/components/form/utils/to-action-state";
import { prisma } from "@/lib/prisma";
import { getAdminOrRedirect } from "@/features/membership/queries/get-admin-or-redirect";
import { inngest } from "@/lib/inngest";
import * as organizationData from "@/features/organization/data";

export async function deleteOrganization(organizationId: string) {
  await getAdminOrRedirect(organizationId);

  try {
    // Check if user is member of the organization he wants to delete
    const organizations = await getOrganizationsByUser();

    const canDelete = organizations.some(
      (organization) => organization.id === organizationId
    );

    if (!canDelete) {
      return toActionState("ERROR", "Not a member of this organization");
    }

    // Fetch all tickets and attachments
    const tickets = await prisma.ticket.findMany({
      where: { organizationId },
      include: { attachments: true },
    });

    const ticketsWithAttachments = tickets.map((ticket) => ({
      ticketId: ticket.id,
      attachments: ticket.attachments.map((attachment) => ({
        attachmentId: attachment.id,
        fileName: attachment.name,
      })),
    }));

    inngest.send({
      name: "app/organization.deleted",
      data: {
        organizationId,
        tickets: ticketsWithAttachments,
      },
    });

    await organizationData.deleteOrganization(organizationId);
  } catch (error) {
    return fromErrorToActionState(error);
  }

  return toActionState("SUCCESS", "Organization deleted");
}
