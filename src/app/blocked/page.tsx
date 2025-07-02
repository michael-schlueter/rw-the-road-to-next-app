import CardCompact from "@/components/card-compact";
import { Button } from "@/components/ui/button";
import { signInPath } from "@/paths";
import Link from "next/link";

export default function BlockedPage() {
  return (
    <div className="flex-1 flex flex-col justify-center items-center">
      <CardCompact
        title="Rate Limit Exceeded"
        description="Too many sign-in attempts"
        className="w-full max-w-[420px] animate-fade-from-top"
        content={
          <div className="space-y-4 text-center">
            <p>
              For security reasons, we have temporarily limited sign-in attempts
              from your IP address
            </p>
            <p>Please try again in a few minutes</p>

            <Button asChild className="mt-4">
              <Link href={signInPath()}>Back to Sign In </Link>
            </Button>
          </div>
        }
      />
    </div>
  );
}
