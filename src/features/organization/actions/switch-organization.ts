"use server";

import { getAuthOrRedirect } from "@/features/auth/queries/get-auth-or-redirect";
import { getOrganizationsByUser } from "../queries/get-organizations-by-user";
import {
  fromErrorToActionState,
  toActionState,
} from "@/components/form/utils/to-action-state";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { organizationsPath } from "@/paths";
import * as organizationService from "@/features/organization/services";

export async function switchOrganization(organizationId: string) {
  const { user } = await getAuthOrRedirect({
    checkActiveOrganization: false,
  });

  try {
    // Check if user is member of the organization he wants to switch to
    const organizations = await getOrganizationsByUser();

    const canSwitch = organizationService.checkOrganizationMembership(
      organizationId,
      organizations
    );

    if (!canSwitch) {
      return toActionState("ERROR", "Not a member of this organization");
    }

    // If one operations fails, both fail (avoid impossible state of multiple active memberships)
    await prisma.$transaction([
      prisma.membership.updateMany({
        where: {
          userId: user.id,
          organizationId: {
            not: organizationId,
          },
        },
        data: {
          isActive: false,
        },
      }),
      prisma.membership.update({
        where: {
          membershipId: {
            userId: user.id,
            organizationId,
          },
        },
        data: {
          isActive: true,
        },
      }),
    ]);
  } catch (error) {
    return fromErrorToActionState(error);
  }

  revalidatePath(organizationsPath());

  return toActionState("SUCCESS", "Active Organization has been switched");
}
