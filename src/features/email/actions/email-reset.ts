"use server";

import {
  ActionState,
  fromErrorToActionState,
  toActionState,
} from "@/components/form/utils/to-action-state";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { hashToken } from "@/utils/crypto";
import { setCookieByKey } from "@/actions/cookies";
import { redirect } from "next/navigation";
import { signInPath } from "@/paths";

const emailResetSchema = z
  .object({
    email: z.string().min(1, { message: "Is required" }).max(191).email(),
  })

export async function emailReset(
  tokenId: string,
  _actionState: ActionState,
  formData: FormData
) {
  try {
    const { email } = emailResetSchema.parse({
      email: formData.get("email"),
    });

    const tokenHash = hashToken(tokenId);

    const emailResetToken = await prisma.emailResetToken.findUnique({
      where: {
        tokenHash,
      },
    });

    if (emailResetToken) {
      await prisma.emailResetToken.delete({
        where: {
          tokenHash,
        },
      });
    }

    if (
      !emailResetToken ||
      Date.now() > emailResetToken.expiresAt.getTime()
    ) {
      return toActionState(
        "ERROR",
        "Expired or invalid verification token",
        formData
      );
    }

    await prisma.session.deleteMany({
      where: {
        userId: emailResetToken.userId,
      },
    });

    await prisma.user.update({
      where: {
        id: emailResetToken.userId,
      },
      data: {
        email,
      },
    });
  } catch (error) {
    return fromErrorToActionState(error, formData);
  }

  await setCookieByKey("toast", "Successfully reset email address");
  redirect(signInPath());
}
