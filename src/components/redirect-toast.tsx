"use client";

import { deleteCookieByKey, getCookieByKey } from "@/actions/cookies";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

const tryParseJsonObject = (value: string) => {
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
};

export default function RedirectToast() {
  const pathname = usePathname();

  useEffect(() => {
    async function showCookieToast() {
      const message = await getCookieByKey("toast");

      if (message) {
        const toastData = tryParseJsonObject(message);

        toast.success(
          typeof toastData === "string" ? (
            message
          ) : (
            <span>
              {toastData.message} -{" "}
              <Link href={toastData.link} className="underline">
                view
              </Link>
            </span>
          )
        );
        await deleteCookieByKey("toast");
      }
    }
    showCookieToast();
  }, [pathname]);

  return null;
}
