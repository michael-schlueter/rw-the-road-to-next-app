"use server";

import { setCookieByKey } from "@/actions/cookies";
import {
  ActionState,
  fromErrorToActionState,
} from "@/components/form/utils/to-action-state";
import { getAuthOrRedirect } from "@/features/auth/queries/get-auth-or-redirect";
import { prisma } from "@/lib/prisma";
import { ticketsPath } from "@/paths";
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

  try {
    const data = createOrganizationSchema.parse({
      name: formData.get("name"),
    });

    // If one operations fails, both fail (avoid impossible state of multiple active memberships)
    await prisma.$transaction([
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
  } catch (error) {
    return fromErrorToActionState(error);
  }

  await setCookieByKey("toast", "Organization created");
  redirect(ticketsPath());
}
