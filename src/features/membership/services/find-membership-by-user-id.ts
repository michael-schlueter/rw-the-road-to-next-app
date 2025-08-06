import { MembershipWithUser } from "../types";

export function findMembershipByUserId(memberships: MembershipWithUser[] | null | undefined,  userId: string) {
  const targetMembership = (memberships ?? []).find(
    (membership) => membership.userId === userId
  );

  return targetMembership;
}
