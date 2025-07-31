import { prisma } from "@/lib/prisma";

export async function findResetToken(tokenHash: string) {
    return await prisma.emailResetToken.findUnique({
          where: {
            tokenHash,
          },
        });
}