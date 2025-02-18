import CardCompact from "@/components/card-compact";
import EmailResetForm from "@/features/email/components/email-reset-form";

type EmailResetPageProps = {
  params: Promise<{
    tokenId: string;
  }>;
};

export default async function EmailResetPage({ params }: EmailResetPageProps) {

   const { tokenId } = await params; 

  return (
    <div className="flex-1 flex flex-col justify-center items-center">
      <CardCompact
        title="New Email"
        description="Enter a new email address for your account."
        className="w-full max-w-[420px] animate-fade-from-top"
        content={<EmailResetForm tokenId={tokenId} />}
      />
    </div>
  );
}
