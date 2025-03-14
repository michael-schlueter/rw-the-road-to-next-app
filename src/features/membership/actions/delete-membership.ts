"use server";

import { getAuthOrRedirect } from "@/features/auth/queries/get-auth-or-redirect";
import { getMemberships } from "../queries/get-memberships";
import { toActionState } from "@/components/form/utils/to-action-state";
import { prisma } from "@/lib/prisma";

export async function deleteMembership({
  userId,
  organizationId,
}: {
  userId: string;
  organizationId: string;
}) {
  await getAuthOrRedirect();

  const memberships = await getMemberships(organizationId);

  const isLastMembership = (memberships ?? []).length <= 1;

  if (isLastMembership) {
    return toActionState(
      "ERROR",
      "You cannot delete the last membership of an organization"
    );
  }

  await prisma.membership.delete({
    where: {
      membershipId: {
        userId,
        organizationId,
      },
    },
  });

  return toActionState("SUCCESS", "The membership has been deleted");
}
