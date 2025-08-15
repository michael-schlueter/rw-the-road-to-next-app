import { prisma } from "@/lib/prisma";

export async function acceptInvitationForNewUser(tokenHash: string) {
  try {
    await prisma.invitation.update({
      where: {
        tokenHash,
      },
      data: {
        status: "ACCEPTED_WITHOUT_ACCOUNT",
      },
    });
  } catch (error) {
    throw error;
  }
}
