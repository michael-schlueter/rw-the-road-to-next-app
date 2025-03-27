import CardCompact from "@/components/card-compact";
import { acceptInvitation } from "@/features/invitations/actions/accept-invitation";
import InvitationAcceptForm from "@/features/invitations/components/invitation-accept-form";

type EmailInvitationpPageProps = {
  params: Promise<{
    tokenId: string;
  }>;
};

export default async function EmailInvitationPage({
  params,
}: EmailInvitationpPageProps) {
  const { tokenId } = await params;

  // Call the server action directly when page loads
  const result = await acceptInvitation(tokenId);

  // Display form if there was an error executing the server action (user was not redirected instantly)
  return (
    <div className="flex-1 flex flex-col justify-center items-center">
      <CardCompact
        title={
          result?.status === "ERROR"
            ? "Invitation Error"
            : "Processing Invitation"
        }
        description={
          result?.status === "ERROR"
            ? result.message || "There was a problem with your invitation."
            : "Please wait while we process your invitation..."
        }
        className="w-full max-w-[420px] animate-fade-from-top"
        content={
          result?.status === "ERROR" ? (
            <InvitationAcceptForm tokenId={tokenId} />
          ) : null
        }
      />
    </div>
  );
}
