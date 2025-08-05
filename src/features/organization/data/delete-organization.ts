"use server";

import { prisma } from "@/lib/prisma";

export async function deleteOrganization(organizationId: string) {
  await prisma.organization.delete({
    where: {
      id: organizationId,
    },
  });
}
