import CardCompact from "@/components/card-compact";
import EmailVerificationForm from "@/features/auth/components/email-verification-form";

export default function EmailVerificationPage() {
  return (
    <div className="flex-1 flex flex-col justify-center items-center">
      <CardCompact
        title="Verify Email"
        description="Please verify your email to continue"
        className="w-full max-w-[420px] animate-fade-from-top"
        content={<EmailVerificationForm />}
      />
    </div>
  );
}
