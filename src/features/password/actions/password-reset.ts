"use server";

import {
  ActionState,
  fromErrorToActionState,
  toActionState,
} from "@/components/form/utils/to-action-state";
import { z } from "zod";
import { hashToken } from "@/utils/crypto";
import { hashPassword } from "../utils/hash-and-verify";
import { setCookieByKey } from "@/actions/cookies";
import { redirect } from "next/navigation";
import { signInPath } from "@/paths";
import * as passwordData from "@/features/password/data";
import * as authData from "@/features/auth/data";

const passwordResetSchema = z
  .object({
    password: z.string().min(6).max(191),
    confirmPassword: z.string().min(6).max(191),
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        code: "custom",
        message: "Passwords do not match",
        path: ["confirmPassword"],
      });
    }
  });

export async function passwordReset(
  tokenId: string,
  _actionState: ActionState,
  formData: FormData
) {
  try {
    const { password } = passwordResetSchema.parse({
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    });

    const tokenHash = hashToken(tokenId);

    const passwordResetToken =
      await passwordData.findPasswordResetTokenByTokenHash(tokenHash);

    if (passwordResetToken) {
      await passwordData.deletePasswordResetToken(tokenHash);
    }

    if (
      !passwordResetToken ||
      Date.now() > passwordResetToken.expiresAt.getTime()
    ) {
      return toActionState(
        "ERROR",
        "Expired or invalid verification token",
        formData
      );
    }

    await authData.invalidateActiveSession(passwordResetToken.userId);

    const passwordHash = await hashPassword(password);

    await passwordData.changePassword(passwordResetToken.userId, passwordHash);
  } catch (error) {
    return fromErrorToActionState(error, formData);
  }

  await setCookieByKey("toast", "Successfully reset password");
  redirect(signInPath());
}
