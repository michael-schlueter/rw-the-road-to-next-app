import { getAuthOrRedirect } from "@/features/auth/queries/get-auth-or-redirect";
import { prisma } from "@/lib/prisma";
import { organizationsPath } from "@/paths";
import { redirect } from "next/navigation";

export async function getOrganizationName(organizationId: string) {
    await getAuthOrRedirect();

    const organization = await prisma.organization.findUnique({
        where: {
            id: organizationId,
        },
        select: {
            name: true,
        }
    });

    if (!organization) {
        redirect(organizationsPath());
    }

    return organization.name;
}