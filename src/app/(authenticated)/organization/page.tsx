import Heading from "@/components/heading";
import Spinner from "@/components/spinner";
import { Button } from "@/components/ui/button";
import OrganizationList from "@/features/organization/components/organization-list";
import { organizationCreatePath } from "@/paths";
import { LucidePlus } from "lucide-react";
import Link from "next/link";
import React, { Suspense } from "react";

export default function OrganizationsPage() {
  return (
    <div className="flex-1 flex flex-col gap-y-8">
      <Heading
        title="Organizations"
        description="All your organizations"
        actions={
          <Button asChild>
            <Link href={organizationCreatePath()}>
              <LucidePlus className="h-4 w-4" />
              Create Organization
            </Link>
          </Button>
        }
      />

      <Suspense fallback={<Spinner />}>
        <OrganizationList />
      </Suspense>
    </div>
  );
}
