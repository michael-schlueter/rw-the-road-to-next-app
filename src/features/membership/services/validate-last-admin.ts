import { MembershipWithUser } from "../types";

export function validateLastAdmin(
  targetMembership: MembershipWithUser,
  memberships: MembershipWithUser[] | undefined | null
) {
  const adminMemberships = (memberships ?? []).filter(
    (membership) => membership.membershipRole === "ADMIN"
  );

  const removesAdmin = targetMembership.membershipRole === "ADMIN";
  const isLastAdmin = adminMemberships.length <= 1;

  return { removesAdmin, isLastAdmin };
}
