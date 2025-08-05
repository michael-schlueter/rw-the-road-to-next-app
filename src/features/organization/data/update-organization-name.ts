"use server";

import { prisma } from "@/lib/prisma";

export async function updateOrganizationName(
  organizationId: string,
  organizationName: string
) {
  await prisma.organization.update({
    where: {
      id: organizationId,
    },
    data: {
      name: organizationName,
    },
  });
}
