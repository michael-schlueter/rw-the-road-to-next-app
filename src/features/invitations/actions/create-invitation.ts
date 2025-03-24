"use server";

import {
  ActionState,
  fromErrorToActionState,
  toActionState,
} from "@/components/form/utils/to-action-state";
import { getAdminOrRedirect } from "@/features/membership/queries/get-admin-or-redirect";
import { prisma } from "@/lib/prisma";
import { invitationsPath } from "@/paths";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const createInvitationSchema = z.object({
  email: z.string().min(1, { message: "Is required" }).max(191).email(),
});

export async function createInvitation(
  organizationId: string,
  _actionState: ActionState,
  formData: FormData
) {
  await getAdminOrRedirect(organizationId);

  try {
    const { email } = createInvitationSchema.parse({
      email: formData.get("email"),
    });

    // Check if email is already registered
    const targetMembership = await prisma.membership.findFirst({
      where: {
        organizationId,
        user: {
          email,
        },
      },
    });

    if (targetMembership) {
      return toActionState(
        "ERROR",
        "User is already a member of this organization"
      );
    }

    // TODO: Invite by email link to join organization
  } catch (error) {
    return fromErrorToActionState(error);
  }

  revalidatePath(invitationsPath(organizationId));

  return toActionState("SUCCESS", "User invited to organization");
}
