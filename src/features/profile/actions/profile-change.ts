"use server";

import {
  ActionState,
  fromErrorToActionState,
  toActionState,
} from "@/components/form/utils/to-action-state";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getAuthOrRedirect } from "@/features/auth/queries/get-auth-or-redirect";

const profileChangeSchema = z.object({
  username: z.string().min(4).max(191),
  firstName: z.string().min(1).max(191),
  lastName: z.string().min(1).max(191),
});

export async function profileChange(
  _actionState: ActionState,
  formData: FormData
) {
  const { user } = await getAuthOrRedirect();

  try {
    const { username, firstName, lastName } = profileChangeSchema.parse({
      username: formData.get("username"),
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
    });

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        username,
        firstName,
        lastName,
      },
    });
  } catch (error) {
    return fromErrorToActionState(error, formData);
  }
  return toActionState("SUCCESS", "Profile Information Updated");
}
