"use server";

import { redirect } from "next/navigation";
import { getAuth } from "../queries/get-auth";
import { signInPath } from "@/paths";
import { lucia } from "@/lib/lucia";
import { cookies } from "next/headers";

export async function signOut() {
    const { session } = await getAuth();

    if (!session) {
        redirect(signInPath());
    }

    await lucia.invalidateSession(session.id);

    const sessionCookie = lucia.createBlankSessionCookie();

    (await cookies()).set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
    );

    redirect(signInPath());
}