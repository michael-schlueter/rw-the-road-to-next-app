"use server";

import { setCookieByKey } from "@/actions/cookies";
import {
  ActionState,
  fromErrorToActionState,
} from "@/components/form/utils/to-action-state";
import { getAuthOrRedirect } from "@/features/auth/queries/get-auth-or-redirect";
import { prisma } from "@/lib/prisma";
import { membershipsPath, ticketsPath } from "@/paths";
import { redirect } from "next/navigation";
import { z } from "zod";

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
    const [, createdOrganization] = await prisma.$transaction([
      prisma.membership.updateMany({
        where: {
          userId: user.id,
        },
        data: {
          isActive: false,
        },
      }),
      prisma.organization.create({
        data: {
          ...data,
          memberships: {
            create: {
              userId: user.id,
              isActive: true,
              membershipRole: "ADMIN",
            },
          },
        },
      }),
    ]);

    organization = createdOrganization;
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
  redirect(ticketsPath());
}
