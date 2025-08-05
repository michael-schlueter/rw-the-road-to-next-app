"use server";

import { prisma } from "@/lib/prisma";

export async function deletePasswordResetToken(tokenHash: string) {
          await prisma.passwordResetToken.delete({
            where: {
              tokenHash,
            },
          });
}