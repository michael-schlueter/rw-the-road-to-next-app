import { getAdminOrRedirect } from "@/features/membership/queries/get-admin-or-redirect";
import { LucideLock } from "lucide-react";
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

  return (
    <div className="space-y-3">
      <div title="Admin Area">
        <LucideLock className="h-5 w-5" />
      </div>
      {children}
    </div>
  );
}
