import { redirect } from "next/navigation";
import { getAuth } from "./get-auth";
import { emailVerificationPath, signInPath } from "@/paths";

export async function getAuthOrRedirect() {
  const auth = await getAuth();

  if (!auth.user) {
    redirect(signInPath());
  }

  if (!auth.user.emailVerified) {
    redirect(emailVerificationPath());
  }

  return auth;
}
