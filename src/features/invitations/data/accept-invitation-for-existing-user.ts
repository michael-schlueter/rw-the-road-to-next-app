import { prisma } from "@/lib/prisma";

export async function acceptInvitationForExistingUser(
  tokenHash: string,
  organizationId: string,
  userId: string
) {
  try {
    prisma.$transaction([
      prisma.invitation.delete({
        where: {
          tokenHash,
        },
      }),
      prisma.membership.create({
        data: {
          organizationId,
          userId,
          membershipRole: "MEMBER",
          isActive: true,
        },
      }),
    ]);
  } catch (error) {
    throw error;
  }
}
