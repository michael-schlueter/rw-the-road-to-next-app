import { prisma } from "@/lib/prisma";
import { getStripeProvisioning } from "../queries/get-stripe-provisioning";
import { MembershipRole } from "@prisma/client";

export async function deprovisionOrganization(organizationId: string) {
  const organization = await prisma.organization.findUniqueOrThrow({
    where: {
      id: organizationId,
    },
    include: {
      invitations: true,
      memberships: true,
    },
  });

  const { allowedMembers, currentMembers } =
    await getStripeProvisioning(organizationId);
  let excessMembers = currentMembers - allowedMembers;

  if (excessMembers <= 0) {
    return;
  }

  await prisma.$transaction(async (tx) => {
    // 1. Delete invitations first
    const invitationsToDelete = organization.invitations.slice(
      0,
      excessMembers
    );

    if (invitationsToDelete.length > 0) {
      await tx.invitation.deleteMany({
        where: {
          organizationId,
          email: {
            in: invitationsToDelete.map((inv) => inv.email),
          },
        },
      });
      excessMembers -= invitationsToDelete.length;
    }

    if (excessMembers <= 0) {
      return;
    }

    // 2. Delete non-admin members
    const nonAdminMemberships = organization.memberships.filter(
      (m) => m.membershipRole === MembershipRole.MEMBER
    );
    const nonAdminMembershipsToDelete = nonAdminMemberships.slice(
      0,
      excessMembers
    );

    if (nonAdminMembershipsToDelete.length > 0) {
      await tx.membership.deleteMany({
        where: {
          userId: {
            in: nonAdminMembershipsToDelete.map((m) => m.userId),
          },
          organizationId,
        },
      });
      excessMembers -= nonAdminMembershipsToDelete.length;
    }

    if (excessMembers <= 0) {
      return;
    }

    // 3. Delete admin members, but leave at least one
    const adminMemberships = organization.memberships.filter(
      (m) => m.membershipRole === MembershipRole.ADMIN
    );

    if (adminMemberships.length > 1) {
      const adminsToRemoveCount = Math.min(
        excessMembers,
        adminMemberships.length - 1
      );

      if (adminsToRemoveCount > 0) {
        const adminMembershipsToDelete = adminMemberships.slice(
          0,
          adminsToRemoveCount
        );
        await tx.membership.deleteMany({
          where: {
            userId: {
              in: adminMembershipsToDelete.map((m) => m.userId),
            },
            organizationId,
          },
        });
      }
    }
  });
}
