"use server";

import { setCookieByKey } from "@/actions/cookies";
import {
  ActionState,
  fromErrorToActionState,
} from "@/components/form/utils/to-action-state";
import { getAuthOrRedirect } from "@/features/auth/queries/get-auth-or-redirect";
import { inngest } from "@/lib/inngest";
import { membershipsPath, organizationsPath } from "@/paths";
import { redirect } from "next/navigation";
import { z } from "zod";
import * as organizationData from "@/features/organization/data";

const createOrganizationSchema = z.object({
  name: z.string().min(1).max(191),
});

export async function createOrganization(
  _actionState: ActionState,
  formData: FormData
) {
  const { user } = await getAuthOrRedirect({
    checkOrganization: false,
    checkActiveOrganization: false,
  });

  let organization;

  try {
    const data = createOrganizationSchema.parse({
      name: formData.get("name"),
    });

    // If one operations fails, both fail (avoid impossible state of multiple active memberships)
    const createdOrganization =
      await organizationData.createOrganizationAndUpdateMemberships(
        user,
        data.name
      );

    organization = createdOrganization;

    await inngest.send({
      name: "app/organization.created",
      data: {
        organizationId: organization.id,
        byEmail: user.email,
      },
    });
  } catch (error) {
    return fromErrorToActionState(error);
  }

  await setCookieByKey(
    "toast",
    JSON.stringify({
      message: "Organization created",
      link: membershipsPath(organization.id),
    })
  );
  redirect(organizationsPath());
}
