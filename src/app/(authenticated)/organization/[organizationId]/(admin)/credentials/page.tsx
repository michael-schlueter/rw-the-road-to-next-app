import Heading from "@/components/heading";
import OrganizationBreadcrumbs from "../_navigation/organization-breadcrumbs";
import { getOrganizationName } from "@/features/organization/queries/get-organization-name";
import CredentialCreateButton from "@/features/credential/components/credential-create-button";
import { Suspense } from "react";
import Spinner from "@/components/spinner";
import CredentialList from "@/features/credential/components/credential-list";

type CredentialsPageProps = {
  params: Promise<{
    organizationId: string;
  }>;
};

export default async function CredentialsPage({
  params,
}: CredentialsPageProps) {
  const { organizationId } = await params;
  const organizationName = await getOrganizationName(organizationId);

  return (
    <div className="flex-1 flex flex-col gap-y-8">
      <Heading
        title="Credentials"
        description="Manage your organization's API secrets"
        tabs={<OrganizationBreadcrumbs organizationName={organizationName} />}
        actions={<CredentialCreateButton organizationId={organizationId} />}
      />

      <Suspense fallback={<Spinner />}>
        <CredentialList organizationId={organizationId} />
      </Suspense>
    </div>
  );
}
