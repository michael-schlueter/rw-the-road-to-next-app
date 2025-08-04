import { prisma } from "@/lib/prisma";
import { MembershipId } from "./delete-membership";

export async function findMembershipById(membershipId: MembershipId) {
     return await prisma.membership.findUnique({
        where: {
            membershipId,
        },
      });
}