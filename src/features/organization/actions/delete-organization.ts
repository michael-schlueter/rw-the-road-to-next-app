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

export async function deleteOrganization(organizationId: string) {
  await getAuthOrRedirect();

  try {
    // Check if user is member of the organization he wants to delete
    const organizations = await getOrganizationsByUser();

    const canDelete = organizations.some(
      (organization) => organization.id === organizationId
    );

    if (!canDelete) {
      return toActionState("ERROR", "Not a member of this organization");
    }

    await prisma.organization.delete({
      where: {
        id: organizationId,
      },
    });
  } catch (error) {
    return fromErrorToActionState(error);
  }

  revalidatePath(organizationsPath());

  return toActionState("SUCCESS", "Organization deleted");
}
