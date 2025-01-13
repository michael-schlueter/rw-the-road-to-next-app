"use server";

import { cookies } from "next/headers";

export async function getCookieByKey(key: string) {
  const cookie = (await cookies()).get(key);

  if (!cookie) {
    return null;
  }

  return cookie.value;
}

export async function setCookieByKey(key: string, value: string) {
  (await cookies()).set(key, value);
}

export async function deleteCookieByKey(key: string) {
  (await cookies()).delete(key);
}
