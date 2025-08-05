"use server";

import { prisma } from "@/lib/prisma";
import { Membership, MembershipRole } from "@prisma/client";

export async function updateMembershipRole(
  membership: Membership,
  membershipRole: MembershipRole
) {
  await prisma.membership.update({
    where: {
      membershipId: {
        userId: membership.userId,
        organizationId: membership.organizationId,
      },
    },
    data: {
      membershipRole,
    },
  });
}
