import {
  LucideBook,
  LucideCircleUser,
  LucideLibrary,
  LucideUsers,
} from "lucide-react";
import { NavItem } from "./types";
import {
  accountProfilePath,
  homePath,
  organizationsPath,
  ticketsPath,
} from "@/paths";

export const navItems: NavItem[] = [
  {
    title: "All Tickets",
    icon: <LucideLibrary />,
    href: homePath(),
  },
  {
    title: "My Tickets",
    icon: <LucideBook />,
    href: ticketsPath(),
  },
  {
    title: "Account",
    icon: <LucideCircleUser />,
    href: accountProfilePath(),
    separator: true,
  },
  {
    title: "Organization",
    icon: <LucideUsers />,
    href: organizationsPath(),
  },
];

export const closedClassName =
  "text-background opacity-0 transition-all duration-300 group-hover:z-40 group-hover:ml-4 group-hover:rounded group-hover:bg-foreground group-hover:p-2 group-hover:opacity-100";
