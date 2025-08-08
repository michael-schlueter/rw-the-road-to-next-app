"use server";

import { MembershipRole } from "@prisma/client";
import { getAdminOrRedirect } from "../queries/get-admin-or-redirect";
import { getMemberships } from "../queries/get-memberships";
import { toActionState } from "@/components/form/utils/to-action-state";
import { revalidatePath } from "next/cache";
import { membershipsPath } from "@/paths";
import * as membershipData from "@/features/membership/data";
import * as membershipService from "@/features/membership/services";

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

  const { memberships } = await getMemberships(organizationId);

  // Check if membership exists
  const targetMembership = membershipService.findMembershipByUserId(
    memberships,
    userId
  );

  if (!targetMembership) {
    return toActionState("ERROR", "Membership not found");
  }

  // Check if user is deleting last admin
  const { removesAdmin, isLastAdmin } = membershipService.validateLastAdmin(targetMembership, memberships);

  if (removesAdmin && isLastAdmin) {
    return toActionState(
      "ERROR",
      "You cannot delete the last admin of an organization"
    );
  }

  // Updating membership role
  await membershipData.updateMembershipRole(targetMembership, membershipRole);

  revalidatePath(membershipsPath(organizationId));

  return toActionState("SUCCESS", "The role has been updated");
}
