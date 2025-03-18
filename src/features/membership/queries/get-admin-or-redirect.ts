import { getAuthOrRedirect } from "@/features/auth/queries/get-auth-or-redirect";
import { getMembership } from "./get-membership";
import { redirect } from "next/navigation";
import { signInPath } from "@/paths";

export async function getAdminOrRedirect(organizationId: string) {
  const auth = await getAuthOrRedirect();

  const membership = await getMembership({
    organizationId,
    userId: auth.user.id,
  });

  if (!membership) {
    redirect(signInPath());
  }

  if (membership.membershipRole !== "ADMIN") {
    redirect(signInPath());
  }

  return { ...auth, membership };
}
