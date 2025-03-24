import Heading from "@/components/heading";
import OrganizationBreadcrumbs from "../_navigation/tabs";
import { Suspense } from "react";
import Spinner from "@/components/spinner";
import InvitationList from "@/features/invitations/components/invitation-list";

type InvitationsPageProps = {
  params: Promise<{
    organizationId: string;
  }>;
};

export default async function InvitationsPage({
  params,
}: InvitationsPageProps) {
  const { organizationId } = await params;

  return (
    <div className="flex-1 flex flex-col gap-y-8">
      <Heading
        title="Invitations"
        description="Manages your organization's invitations"
        tabs={<OrganizationBreadcrumbs />}
      />

      <Suspense fallback={<Spinner />}>
        <InvitationList organizationId={organizationId} />
      </Suspense>
    </div>
  );
}
