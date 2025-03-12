import { redirect } from "next/navigation";
import { getAuth } from "./get-auth";
import {
  emailVerificationPath,
  onboardingPath,
  selectActiveOrganizationPath,
  signInPath,
} from "@/paths";
import { getOrganizationsByUser } from "@/features/organization/queries/get-organizations-by-user";

type GetAuthOrRedirectOptions = {
  checkEmailVerified?: boolean;
  checkOrganization?: boolean;
  checkActiveOrganization?: boolean;
};

export async function getAuthOrRedirect(options?: GetAuthOrRedirectOptions) {
  const {
    checkEmailVerified = true,
    checkOrganization = true,
    checkActiveOrganization = true,
  } = options ?? {};

  const auth = await getAuth();

  if (!auth.user) {
    redirect(signInPath());
  }

  if (checkEmailVerified && !auth.user.emailVerified) {
    redirect(emailVerificationPath());
  }

  if (checkOrganization || checkActiveOrganization) {
    const organizations = await getOrganizationsByUser();

    if (checkOrganization && !organizations.length) {
      redirect(onboardingPath());
    }

    const hasActive = organizations.some((organization) => {
      return organization.membershipByUser.isActive;
    });

    if (checkActiveOrganization && !hasActive) {
      redirect(selectActiveOrganizationPath());
    }
  }

  return auth;
}
