"use client";

import { deleteCookieByKey, getCookieByKey } from "@/actions/cookies";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export default function RedirectToast() {
  const pathname = usePathname();

  useEffect(() => {
    async function showCookieToast() {
      const message = await getCookieByKey("toast");

      if (message) {
        toast.success(message);
        await deleteCookieByKey("toast");
      }
    }
    showCookieToast();
  }, [pathname]);

  return null;
}
