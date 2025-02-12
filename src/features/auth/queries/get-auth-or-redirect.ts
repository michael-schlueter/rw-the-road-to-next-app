import { redirect } from "next/navigation";
import { getAuth } from "./get-auth";
import { emailVerificationPath, signInPath } from "@/paths";

type GetAuthOrRedirectOptions = {
  checkEmailVerified?: boolean;
};

export async function getAuthOrRedirect(options?: GetAuthOrRedirectOptions) {
  const { checkEmailVerified = true } = options ?? {};

  const auth = await getAuth();

  if (!auth.user) {
    redirect(signInPath());
  }

  if (checkEmailVerified && !auth.user.emailVerified) {
    redirect(emailVerificationPath());
  }

  return auth;
}
