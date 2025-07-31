"use server";

import {
  ActionState,
  fromErrorToActionState,
  toActionState,
} from "@/components/form/utils/to-action-state";
import { z } from "zod";
import { getAuthOrRedirect } from "@/features/auth/queries/get-auth-or-redirect";
import { inngest } from "@/lib/inngest";
import * as authData from "@/features/auth/data";

const emailChangeSchema = z.object({
  email: z.string().min(1, { message: "Is required" }).max(191).email(),
});

export async function emailChange(
  _actionState: ActionState,
  formData: FormData
) {
  const auth = await getAuthOrRedirect();

  try {
    const { email } = emailChangeSchema.parse({
      email: formData.get("email"),
    });

    const user = await authData.findUserByEmail(auth.user.email);

    if (!user) {
      // we should never reach this return statement but it's here just in case
      return toActionState("ERROR", "Invalid request", formData);
    }

    const validEmail = email === auth.user.email;

    if (!validEmail) {
      return toActionState("ERROR", "Incorrect email address", formData);
    }

    await inngest.send({
      name: "app/email.email-reset",
      data: {
        userId: user.id,
      },
    });
  } catch (error) {
    return fromErrorToActionState(error, formData);
  }
  return toActionState("SUCCESS", "Check your email for a reset link");
}
