"use server";

import { revalidatePath } from "next/cache";
import { toActionState } from "@/components/form/utils/to-action-state";
import { membershipsPath } from "@/paths";
import { getAdminOrRedirect } from "../queries/get-admin-or-redirect";
import * as membershipData from "@/features/membership/data";

export type PermissionKey = "canDeleteTicket" | "canUpdateTicket";

export const togglePermission = async ({
  userId,
  organizationId,
  permissionKey,
}: {
  userId: string;
  organizationId: string;
  permissionKey: PermissionKey;
}) => {
  await getAdminOrRedirect(organizationId);

  const where = {
    membershipId: {
      userId,
      organizationId,
    },
  };

  const membership = await membershipData.findMembershipById(
    where.membershipId
  );

  if (!membership) {
    return toActionState("ERROR", "Membership not found");
  }

  await membershipData.toggleMembership(membership, permissionKey);

  revalidatePath(membershipsPath(organizationId));

  return toActionState("SUCCESS", "Permission updated");
};
