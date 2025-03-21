import { getAuth } from "@/features/auth/queries/get-auth";
import { prisma } from "@/lib/prisma";

export async function getActiveMembership() {
    const { user } = await getAuth();

    if (!user) return null;

    const activeMembership = await prisma.membership.findFirst({
        where: {
            userId: user.id,
            isActive: true,
        }
    });

    return activeMembership;
} 