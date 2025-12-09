import { usePathname } from "next/navigation";
import { NavItem } from "../types";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { cloneElement } from "react";
import { closedClassName } from "../constants";
import { SidebarSeparator } from "@/components/ui/sidebar";

type SidebarItemProps = {
  isOpen: boolean;
  navItem: NavItem;
};

export default function SidebarItem({ isOpen, navItem }: SidebarItemProps) {
  const path = usePathname();
  const isActive = path === navItem.href;

  return (
    <>
      {navItem.separator && <SidebarSeparator />}
      <Link
        href={navItem.href}
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "group relative flex h-12 justify-start",
          isActive && "bg-muted font-bold hover:bg-muted"
        )}
      >
        {cloneElement(navItem.icon, {
          className: cn("h-5 w-5", navItem.icon.props.className),
        })}
        <span
          className={cn(
            "absolute left-12 text-base duration-200",
            isOpen ? "md:block hidden" : "w-[78px]",
            !isOpen && closedClassName
          )}
        >
          {navItem.title}
        </span>
      </Link>
    </>
  );
}
