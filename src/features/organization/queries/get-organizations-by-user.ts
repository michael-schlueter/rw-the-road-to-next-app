import { prisma } from "@/lib/prisma";

export async function getOrganizationsByUser(userId: string | undefined) {
  if (!userId) {
    return [];
  }

  const organizations = await prisma.organization.findMany({
    where: {
      memberships: {
        some: {
          userId,
        },
      },
    },
    include: {
      memberships: true,
    },
  });

  return organizations;
}
