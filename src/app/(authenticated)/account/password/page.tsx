import Heading from "@/components/heading";
import AccountTabs from "@/app/(authenticated)/account/_navigation/tabs";

export default function PasswordPage() {
  return (
    <div className="flex-1 flex flex-col gap-y-8">
      <Heading
        title="Password"
        description="Keep your account secure"
        tabs={<AccountTabs />}
      />
    </div>
  );
}
