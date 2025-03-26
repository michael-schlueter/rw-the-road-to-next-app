import Heading from "@/components/heading";
import OrganizationBreadcrumbs from "../_navigation/organization-breadcrumbs";
import { Suspense } from "react";
import Spinner from "@/components/spinner";
import InvitationList from "@/features/invitations/components/invitation-list";
import InvitationCreateButton from "@/features/invitations/components/invitation-create-button";
import { getOrganizationName } from "@/features/organization/queries/get-organization-name";

type InvitationsPageProps = {
  params: Promise<{
    organizationId: string;
  }>;
};

export default async function InvitationsPage({
  params,
}: InvitationsPageProps) {
  const { organizationId } = await params;
  const organizationName = await getOrganizationName(organizationId);

  return (
    <div className="flex-1 flex flex-col gap-y-8">
      <Heading
        title="Invitations"
        description="Manages your organization's invitations"
        breadcrumbs={<OrganizationBreadcrumbs organizationName={organizationName} />}
        actions={<InvitationCreateButton organizationId={organizationId} />}
      />

      <Suspense fallback={<Spinner />}>
        <InvitationList organizationId={organizationId} />
      </Suspense>
    </div>
  );
}
