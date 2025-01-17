import { homePath, signInPath, signUpPath, ticketsPath } from "@/paths";
import { LucideKanban, LucideLogOut } from "lucide-react";
import { buttonVariants } from "./ui/button";
import Link from "next/link";
import ThemeSwitcher from "./themes/theme-switcher";
import { signOut } from "@/features/auth/actions/sign-out";
import SubmitButton from "./form/submit-button";

export default function Header() {
  const navItems = (
    <>
      <Link
        href={ticketsPath()}
        className={buttonVariants({ variant: "default" })}
      >
        Tickets
      </Link>
      <Link
        href={signUpPath()}
        className={buttonVariants({ variant: "outline" })}
      >
        Sign Up
      </Link>
      <Link
        href={signInPath()}
        className={buttonVariants({ variant: "outline" })}
      >
        Sign In
      </Link>
      <form action={signOut}>
        <SubmitButton label="Sign Out" icon={<LucideLogOut />} />
      </form>
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
