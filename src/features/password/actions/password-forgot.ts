"use server";

import {
  ActionState,
  fromErrorToActionState,
  toActionState,
} from "@/components/form/utils/to-action-state";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { inngest } from "@/lib/inngest";

const passwordForgotSchema = z.object({
  email: z.string().min(1, { message: "Is required" }).max(191).email(),
});

export async function passwordForgot(
  _actionState: ActionState,
  formData: FormData
) {
  try {
    const { email } = passwordForgotSchema.parse({
      email: formData.get("email"),
    });

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return toActionState("SUCCESS", "Check your email for a reset link");
    }

    await inngest.send({
      name: "app/password.password-reset",
      data: {
        userId: user.id,
      },
    });
  } catch (error) {
    return fromErrorToActionState(error, formData);
  }

  return toActionState("SUCCESS", "Check your email for a reset link");
}
