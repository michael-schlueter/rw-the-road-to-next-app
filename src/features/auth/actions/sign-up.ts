"use server";

import {
  ActionState,
  fromErrorToActionState,
  toActionState,
} from "@/components/form/utils/to-action-state";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ticketsPath } from "@/paths";
import { Prisma } from "@prisma/client";
import { hashPassword } from "@/features/password/utils/hash-and-verify";
import { generateRandomToken } from "@/utils/crypto";
import { setSessionCookie } from "../utils/session-cookie";
import { createSession } from "@/lib/lucia";
import { inngest } from "@/lib/inngest";

const signUpSchema = z
  .object({
    username: z
      .string()
      .min(1)
      .max(191)
      .refine(
        (value) => !value.includes(" "),
        "Username cannot contain spaces"
      ),
    email: z.string().min(1, { message: "Is required" }).max(191).email(),
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

export async function signUp(_actionState: ActionState, formData: FormData) {
  try {
    const { username, email, password } = signUpSchema.parse(
      Object.fromEntries(formData)
    );
    const passwordHash = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        username,
        email,
        passwordHash,
      },
    });

    const invitations = await prisma.invitation.findMany({
      where: {
        email,
        status: "ACCEPTED_WITHOUT_ACCOUNT",
      },
    });

    await prisma.$transaction([
      prisma.invitation.deleteMany({
        where: {
          email,
        },
      }),
      prisma.membership.createMany({
        data: invitations.map((invitation) => ({
          organizationId: invitation.organizationId,
          userId: user.id,
          membershipRole: "MEMBER",
          isActive: false,
        })),
      }),
    ]);

    await inngest.send({
      name: "app/auth.sign-up",
      data: {
        userId: user.id,
      },
    });

    const sessionToken = generateRandomToken();
    const session = await createSession(sessionToken, user.id);

    await setSessionCookie(sessionToken, session.expiresAt);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return toActionState(
        "ERROR",
        "Either email or username is already in use",
        formData
      );
    }

    return fromErrorToActionState(error, formData);
  }

  redirect(ticketsPath());
}
