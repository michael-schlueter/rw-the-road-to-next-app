import { MembershipRole, Organization } from "@prisma/client";

type OrganizationWithMembership = Omit<Organization, "membership"> & {
  membershipByUser?: {
    userId: string;
    organizationId: string;
    joinedAt: Date;
    isActive: boolean;
    membershipRole: MembershipRole;
    canDeleteTicket: boolean;
    canUpdateTicket: boolean;
  };
};

export function checkOrganizationMembership(
  organizationId: string,
  organizations: OrganizationWithMembership[]
) {
  return organizations.some(
    (organization) => organization.id === organizationId
  );
}
