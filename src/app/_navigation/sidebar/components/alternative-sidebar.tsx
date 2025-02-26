"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  useSidebar,
} from "@/components/ui/sidebar";
import { navItems } from "../constants";
import { useAuth } from "@/features/auth/hooks/use-auth";
import SidebarItem from "./sidebar-item";

export function AlternativeSidebar() {
  const { user, isFetched } = useAuth();
  const { setOpen, open } = useSidebar();

  if (!user || !isFetched) {
    return <div className="w-[78px] bg-secondary/20"></div>;
  }

  return (
    <Sidebar
      className="pt-24"
      collapsible="icon"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <SidebarContent className="bg-white px-3 py-2">
        <SidebarMenu className="space-y-2">
          {navItems.map((item) => (
            <SidebarItem key={item.title} isOpen={open} navItem={item} />
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
