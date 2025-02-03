import CardCompact from "@/components/card-compact";
import SignInForm from "@/features/auth/components/sign-in-form";
import { passwordForgotPath, signUpPath } from "@/paths";
import Link from "next/link";

export default function SignInPage() {
  return (
    <div className="flex-1 flex flex-col justify-center items-center">
      <CardCompact
        title="Sign In"
        description="Sign in to your account"
        className="w-full max-w-[420px] animate-fade-from-top"
        content={<SignInForm />}
        footer={
          <div className="w-full flex justify-between">
            <Link className="text-sm text-muted-foreground" href={signUpPath()}>
              No account yet?
            </Link>

            <Link
              className="text-sm text-muted-foreground"
              href={passwordForgotPath()}
            >
              Forgot Password?
            </Link>
          </div>
        }
      />
    </div>
  );
}
