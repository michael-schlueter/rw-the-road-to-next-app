import Heading from "@/components/heading";
import Spinner from "@/components/spinner";
import MembershipList from "@/features/membership/components/membership-list";
import { Suspense } from "react";
import OrganizationBreadcrumbs from "../_navigation/tabs";
import InvitationCreateButton from "@/features/invitations/components/invitation-create-button";

type MembershipsPageProps = {
  params: Promise<{
    organizationId: string;
  }>;
};

export default async function MembershipsPage({
  params,
}: MembershipsPageProps) {
  const { organizationId } = await params;

  return (
    <div className="flex-1 flex flex-col gap-y-8">
      <Heading
        title="Memberships"
        description="Manage members in your organization"
        tabs={<OrganizationBreadcrumbs />}
        actions={<InvitationCreateButton organizationId={organizationId} />}
      />

      <Suspense fallback={<Spinner />}>
        <MembershipList organizationId={organizationId} />
      </Suspense>
    </div>
  );
}
