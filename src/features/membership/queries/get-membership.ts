import { getAuthOrRedirect } from "@/features/auth/queries/get-auth-or-redirect";
import { prisma } from "@/lib/prisma";

export async function getMembership({
  organizationId,
  userId,
}: {
  organizationId: string;
  userId: string;
}) {
  await getAuthOrRedirect();

  return await prisma.membership.findUnique({
    where: {
      membershipId: {
        organizationId,
        userId,
      },
    },
  });
}
