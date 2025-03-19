import { MembershipRole } from "@prisma/client";
import { getAdminOrRedirect } from "../queries/get-admin-or-redirect";
import { getMemberships } from "../queries/get-memberships";
import { toActionState } from "@/components/form/utils/to-action-state";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { membershipsPath } from "@/paths";

export async function updateMembershipRole({
  userId,
  organizationId,
  membershipRole,
}: {
  userId: string;
  organizationId: string;
  membershipRole: MembershipRole;
}) {
  // Check if user is admin
  await getAdminOrRedirect(organizationId);

  const memberships = await getMemberships(organizationId);

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

  // Updating membership role
  await prisma.membership.update({
    where: {
      membershipId: {
        userId,
        organizationId,
      },
    },
    data: {
      membershipRole,
    },
  });

  revalidatePath(membershipsPath(organizationId));

  return toActionState("SUCCESS", "The role has been updated");
}
