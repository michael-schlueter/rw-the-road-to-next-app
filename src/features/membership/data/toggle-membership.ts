import { prisma } from "@/lib/prisma";
import { PermissionKey } from "../actions/toggle-permission";
import { Membership } from "@prisma/client";

export async function toggleMembership(
  membership: Membership,
  permissionKey: PermissionKey
) {
  await prisma.membership.update({
    where: {
      membershipId: {
        userId: membership.userId,
        organizationId: membership.organizationId,
      },
    },
    data: {
      [permissionKey]: membership[permissionKey] === true ? false : true,
    },
  });
}
