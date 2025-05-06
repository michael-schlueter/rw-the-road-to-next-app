"use server";

import { getAuthOrRedirect } from "@/features/auth/queries/get-auth-or-redirect";
import { getMemberships } from "../queries/get-memberships";
import { toActionState } from "@/components/form/utils/to-action-state";
import { prisma } from "@/lib/prisma";
import { setCookieByKey } from "@/actions/cookies";

export async function deleteMembership({
  userId,
  organizationId,
}: {
  userId: string;
  organizationId: string;
}) {
  const { user } = await getAuthOrRedirect();

  const { memberships } = await getMemberships(organizationId);

  // Check if it's the last membership
  const isLastMembership = (memberships ?? []).length <= 1;

  if (isLastMembership) {
    return toActionState(
      "ERROR",
      "You cannot delete the last membership of an organization"
    );
  }

  // Check if membership exists

  const targetMembership = (memberships ?? []).find(
    (membership) => membership.userId === userId
  );

  if (!targetMembership) {
    return toActionState("ERROR", "Membership not found");
  }

  // Check if user is deleting last admin

  const adminMemberships = (memberships ?? []).filter(
    (membership) => membership.membershipRole === "ADMIN"
  );
  const removesAdmin = targetMembership.membershipRole === "ADMIN";
  const isLastAdmin = adminMemberships.length <= 1;

  if (removesAdmin && isLastAdmin) {
    return toActionState(
      "ERROR",
      "You cannot delete the last admin of an organization"
    );
  }

  // Check if user is deleting him/herself
  const myMembership = (memberships ?? []).find(
    (membership) => membership.userId === user?.id
  );

  const isMyself = user.id === userId;
  const isAdmin = myMembership?.membershipRole === "ADMIN";

  if (!isMyself && !isAdmin) {
    return toActionState(
      "ERROR",
      "You can only delete memberships as an admin"
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

  await setCookieByKey(
    "toast",
    isMyself
      ? "You have left the organization"
      : "The membership has been deleted"
  );
}
