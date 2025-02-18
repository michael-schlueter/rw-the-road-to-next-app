import Heading from "@/components/heading";
import AccountTabs from "@/app/(authenticated)/account/_navigation/tabs";
import CardCompact from "@/components/card-compact";
import EmailChangeForm from "@/features/email/components/email-change-form";

export default function EmaildPage() {
  return (
    <div className="flex-1 flex flex-col gap-y-8">
      <Heading
        title="Email"
        description="Keep your email up to date"
        tabs={<AccountTabs />}
      />
      <div className="flex-1 flex flex-col items-center">
        <CardCompact
          title="Change Email"
          description="Enter your current email address."
          className="w-full max-w-[420px] animate-fade-from-top"
          content={<EmailChangeForm />}
        />
      </div>
    </div>
  );
}
