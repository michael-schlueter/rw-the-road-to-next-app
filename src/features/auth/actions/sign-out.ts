"use server";

import { redirect } from "next/navigation";
import { getAuth } from "../queries/get-auth";
import { signInPath } from "@/paths";
import { deleteSessionCookie } from "../utils/session-cookie";
import { invalidateSession } from "@/lib/lucia";

export async function signOut() {
  const { session } = await getAuth();

  if (!session) {
    redirect(signInPath());
  }

  await invalidateSession(session.id);
  await deleteSessionCookie();

  redirect(signInPath());
}
