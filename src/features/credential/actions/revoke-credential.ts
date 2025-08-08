"use server";

import {
  fromErrorToActionState,
  toActionState,
} from "@/components/form/utils/to-action-state";
import { getAdminOrRedirect } from "@/features/membership/queries/get-admin-or-redirect";
import { getOrganizationsByUser } from "@/features/organization/queries/get-organizations-by-user";
import { prisma } from "@/lib/prisma";
import * as organizationService from "@/features/organization/services";

export async function revokeCredential(
  credentialId: string,
  organizationId: string
) {
  await getAdminOrRedirect(organizationId);

  try {
    // Check if user is member of the organization he wants to delete a credential for
    const organizations = await getOrganizationsByUser();

    const canRevoke = organizationService.checkOrganizationMembership(
      organizationId,
      organizations
    );

    if (!canRevoke) {
      return toActionState("ERROR", "Not a member of this organization");
    }

    await prisma.credential.update({
      where: {
        id: credentialId,
      },
      data: {
        revokedAt: new Date(),
      },
    });
  } catch (error) {
    return fromErrorToActionState(error);
  }

  return toActionState("SUCCESS", "Credential revoked");
}
