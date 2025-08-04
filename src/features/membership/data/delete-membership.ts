import { prisma } from "@/lib/prisma";

export type MembershipId = {
    userId: string;
    organizationId: string;
}

export async function deleteMembership(membershipId: MembershipId) {
    return await prisma.membership.delete({
        where: {
          membershipId,
        },
      });
}