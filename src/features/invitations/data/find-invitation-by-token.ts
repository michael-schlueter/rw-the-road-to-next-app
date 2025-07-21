import { prisma } from "@/lib/prisma";

export async function findInvitationByToken(tokenHash: string) {
  return await prisma.invitation.findUnique({
    where: {
      tokenHash,
    },
  });
}
