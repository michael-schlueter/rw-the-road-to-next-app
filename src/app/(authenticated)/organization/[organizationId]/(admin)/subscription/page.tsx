import Heading from "@/components/heading";
import OrganizationBreadcrumbs from "../_navigation/organization-breadcrumbs";
import Placeholder from "@/components/placeholder";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { pricingPath } from "@/paths";
import { getOrganizationName } from "@/features/organization/queries/get-organization-name";

type SubscriptionPageProps = {
  params: Promise<{
    organizationId: string;
  }>;
};

export default async function SubscriptionPage({
  params,
}: SubscriptionPageProps) {
  const { organizationId } = await params;
  const organizationName = await getOrganizationName(organizationId);

  return (
    <div className="flex-1 flex flex-col gap-y-8">
      <Heading
        title="Subscription"
        description="Manage your subscription"
        tabs={<OrganizationBreadcrumbs organizationName={organizationName} />}
      />

      <Placeholder
        label="No subscription for this organization"
        button={
          <Button asChild variant="outline">
            <Link href={pricingPath()}>Go to Pricing</Link>
          </Button>
        }
      />
    </div>
  );
}
