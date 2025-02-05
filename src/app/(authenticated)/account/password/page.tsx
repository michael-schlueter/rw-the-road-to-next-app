import Heading from "@/components/heading";
import AccountTabs from "@/app/(authenticated)/account/_navigation/tabs";
import CardCompact from "@/components/card-compact";
import PasswordChangeForm from "@/features/password/components/password-change-form";

export default function PasswordPage() {
  return (
    <div className="flex-1 flex flex-col gap-y-8">
      <Heading
        title="Password"
        description="Keep your account secure"
        tabs={<AccountTabs />}
      />
      <div className="flex-1 flex flex-col items-center">
        <CardCompact
          title="Change Password"
          description="Enter your current password."
          className="w-full max-w-[420px] animate-fade-from-top"
          content={<PasswordChangeForm />}
        />
      </div>
    </div>
  );
}
