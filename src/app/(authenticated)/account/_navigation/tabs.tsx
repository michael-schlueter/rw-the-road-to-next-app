"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  accountEmailPath,
  accountPasswordPath,
  accountProfilePath,
} from "@/paths";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AccountTabs() {
  const pathName = usePathname();

  return (
    <Tabs value={pathName.split("/").at(-1)}>
      <TabsList>
        <TabsTrigger value="profile" asChild>
          <Link href={accountProfilePath()}>Profile</Link>
        </TabsTrigger>
        <TabsTrigger value="password" asChild>
          <Link href={accountPasswordPath()}>Password</Link>
        </TabsTrigger>
        <TabsTrigger value="email" asChild>
          <Link href={accountEmailPath()}>Email</Link>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
