"use client";

import Link from "next/link";
import { buttonVariants } from "./ui/button";
import { organizationsPath } from "@/paths";
import { useActiveOrganization } from "@/features/organization/hooks/use-active-organization";
import { useAuth } from "@/features/auth/hooks/use-auth";

export default function Footer() {
  const { organization, isFetched } = useActiveOrganization();
  const { user } = useAuth();


  if (!isFetched || !organization || !user) return null;

  return (
    <footer
      className="
    supports-backdrop-blur:bg-background/60
    fixed left-0 right-0 bottom-0 z-20
    border-t bg-background/95 backdrop-blur
    w-full flex py-2.5 px-5
  "
    >
      <div className="flex items-center">
        {organization ? (
          <>
            <p className="text-sm text-muted-foreground">Active Organization: {organization.name}</p>
            <Link
              href={organizationsPath()}
              className={buttonVariants({ variant: "link" })}
            >
              Switch
            </Link>
          </>
        ) : null}
      </div>
    </footer>
  );
}
