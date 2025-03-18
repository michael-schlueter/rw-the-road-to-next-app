import { getAdminOrRedirect } from "@/features/membership/queries/get-admin-or-redirect";
import React from "react";

export default async function AdminLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ organizationId: string }>;
}>) {
  const { organizationId } = await params;

  await getAdminOrRedirect(organizationId);

  return <>{children}</>;
}
