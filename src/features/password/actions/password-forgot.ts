"use server";

import {
  ActionState,
  fromErrorToActionState,
  toActionState,
} from "@/components/form/utils/to-action-state";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { generatePasswordResetLink } from "../utils/generate-password-reset-link";

const passwordForgotSchema = z.object({
  email: z.string().min(1, { message: "Is required" }).max(191).email(),
});

export async function passwordForgot(
  _actionState: ActionState,
  formData: FormData
) {
  try {
    const { email } = passwordForgotSchema.parse(Object.fromEntries(formData));

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return toActionState("ERROR", "Incorrect email or password", formData);
    }

    const passwordLink = await generatePasswordResetLink(user.id);
    console.log(passwordLink);

    // TODO: Send email with reset link
  } catch (error) {
    return fromErrorToActionState(error, formData);
  }

  return toActionState("SUCCESS", "Check your email for a reset link");
}
