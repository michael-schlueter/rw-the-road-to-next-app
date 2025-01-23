"use client";

import { homePath, signInPath, signUpPath } from "@/paths";
import { LucideKanban } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { buttonVariants } from "@/components/ui/button";
import ThemeSwitcher from "@/components/themes/theme-switcher";
import AccountDropdown from "./account-dropdown";

export default function Header() {
  const { user, isFetched } = useAuth();

  if (!isFetched) return null;

  const navItems = user ? (
    <AccountDropdown user={user} />
  ) : (
    <>
      <Link
        href={signUpPath()}
        className={buttonVariants({ variant: "outline" })}
      >
        Sign Up
      </Link>
      <Link
        href={signInPath()}
        className={buttonVariants({ variant: "default" })}
      >
        Sign In
      </Link>
    </>
  );

  return (
    <nav
      className="
      supports-backdrop-blur:bg-background/60
      fixed left-0 right-0 top-0 z-20
      border-b bg-background/95 backdrop-blur
      w-full flex py-2.5 px-5 justify-between
    "
    >
      <div>
        <Link
          href={homePath()}
          className={buttonVariants({ variant: "ghost" })}
        >
          <LucideKanban />
          <h1 className="text-lg font-semibold">TicketBounty</h1>
        </Link>
      </div>
      <div className="flex items-center gap-x-2">
        <ThemeSwitcher />
        {navItems}
      </div>
    </nav>
  );
}
