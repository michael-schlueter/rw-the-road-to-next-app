import { prisma } from "@/lib/prisma";

export async function deleteResetToken(tokenHash: string) {
  return await prisma.emailResetToken.delete({
    where: {
      tokenHash,
    },
  });
}
