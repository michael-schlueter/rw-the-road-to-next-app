import type { ReactElement } from "react";

export type NavItem = {
  title: string;
  icon: ReactElement<{ className?: string }>;
  href: string;
  separator?: boolean;
};
