import Heading from "@/components/heading";
import AccountTabs from "@/app/(authenticated)/account/_navigation/tabs";
import CardCompact from "@/components/card-compact";
import ProfileChangeForm from "@/features/profile/components/profile-change-form";

export default function ProfilePage() {
  return (
    <div className="flex-1 flex flex-col gap-y-8">
      <Heading
        title="Profile"
        description="All your profile information"
        tabs={<AccountTabs />}
      />
      <div className="flex-1 flex flex-col items-center">
        <CardCompact
          title="Change Profile Information"
          description="Enter your profile information."
          className="w-full max-w-[420px] animate-fade-from-top"
          content={<ProfileChangeForm />}
        />
      </div>
    </div>
  );
}
