"use server";

import { getOrganizationsByUser } from "../queries/get-organizations-by-user";
import {
  fromErrorToActionState,
  toActionState,
} from "@/components/form/utils/to-action-state";
import { getAdminOrRedirect } from "@/features/membership/queries/get-admin-or-redirect";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { organizationsPath } from "@/paths";
import * as organizationData from "@/features/organization/data";

const editOrganizationSchema = z.object({
  name: z.string().min(1).max(191),
});

export async function editOrganization(
  organizationId: string,
  formData: FormData
) {
  await getAdminOrRedirect(organizationId);

  try {
    const data = editOrganizationSchema.parse({
      name: formData.get("name"),
    });

    // Check if user is member of the organization he wants to edit
    const organizations = await getOrganizationsByUser();

    const canEdit = organizations.some(
      (organization) => organization.id === organizationId
    );

    if (!canEdit) {
      return toActionState("ERROR", "Not a member of this organization");
    }

    await organizationData.updateOrganizationName(organizationId, data.name);
  } catch (error) {
    return fromErrorToActionState(error);
  }

  revalidatePath(organizationsPath());
  return toActionState("SUCCESS", "Organization name updated");
}
