import { prisma } from "@/lib/prisma";
import { InvitationId } from "./delete-invitation";

export async function findInvitationById(invitationId: InvitationId) {
  return await prisma.invitation.findUnique({
    where: {
      invitationId,
    },
  });
}
