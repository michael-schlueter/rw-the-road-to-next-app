import { prisma } from "@/lib/prisma";

type GetTicketPermissions = {
  organizationId: string | undefined;
  userId: string | undefined;
};

export async function getTicketPermissions({
  organizationId,
  userId,
}: GetTicketPermissions) {
  if (!organizationId || !userId) {
    return {
      canDeleteTicket: false,
      canUpdateTicket: false,
    };
  }

  const membership = await prisma.membership.findUnique({
    where: {
      membershipId: {
        userId,
        organizationId,
      },
    },
  });

  if (!membership) {
    return {
      canDeleteTicket: false,
      canUpdateTicket: false,
    };
  }

  return {
    canDeleteTicket: membership.canDeleteTicket,
    canUpdateTicket: membership.canUpdateTicket,
  }
}
