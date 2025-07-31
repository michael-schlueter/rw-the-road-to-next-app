import { prisma } from "@/lib/prisma";

export type InvitationId = {
  organizationId: string;
  email: string;
};

export async function deleteInvitation(invitationId: InvitationId) {
  return await prisma.invitation.delete({
    where: {
      invitationId,
    },
  });
}
