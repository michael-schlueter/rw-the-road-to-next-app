"use server";

import { prisma } from "@/lib/prisma";

export async function findPasswordResetTokenByTokenHash(tokenHash: string) {
    return await prisma.passwordResetToken.findUnique({
          where: {
            tokenHash,
          },
        });
}