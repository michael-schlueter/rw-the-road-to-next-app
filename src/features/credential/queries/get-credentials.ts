import { getAdminOrRedirect } from "@/features/membership/queries/get-admin-or-redirect";
import { prisma } from "@/lib/prisma";

export async function getCredentials(organizationId: string) {
  await getAdminOrRedirect(organizationId);

  return await prisma.credential.findMany({
    where: {
      organizationId,
    },
    select: {
      id: true,
      createdAt: true,
      name: true,
      lastUsed: true,
      userId: true,
      revokedAt: true,
      createdByUserId: {
        select: {
          username: true,
        }
      }
    },
  });
}
