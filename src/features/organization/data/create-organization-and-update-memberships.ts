"use server";

import { prisma } from "@/lib/prisma";
import { User } from "@prisma/client";

export async function createOrganizationAndUpdateMemberships(user: User, organizationName: string) {
        const [, createdOrganization] = await prisma.$transaction([
          prisma.membership.updateMany({
            where: {
              userId: user.id,
            },
            data: {
              isActive: false,
            },
          }),
          prisma.organization.create({
            data: {
              name: organizationName,
              memberships: {
                create: {
                  userId: user.id,
                  isActive: true,
                  membershipRole: "ADMIN",
                },
              },
            },
          }),
        ]);

        return createdOrganization;
}