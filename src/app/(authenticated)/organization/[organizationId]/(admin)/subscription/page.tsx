import Heading from "@/components/heading";
import OrganizationBreadcrumbs from "../_navigation/organization-breadcrumbs";
import { getOrganizationName } from "@/features/organization/queries/get-organization-name";
import CustomerPortalForm from "@/features/stripe/components/customer-portal-form";
import { LucideSettings } from "lucide-react";
import { Suspense } from "react";
import Products from "@/features/stripe/components/products";
import Spinner from "@/components/spinner";

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
        actions={
          <CustomerPortalForm organizationId={organizationId}>
            <>
              <LucideSettings className="h-4 w-4" />
              Manage Subscription
            </>
          </CustomerPortalForm>
        }
      />

      <Suspense fallback={<Spinner />}>
        <Products organizationId={organizationId} />
      </Suspense>
    </div>
  );
}
