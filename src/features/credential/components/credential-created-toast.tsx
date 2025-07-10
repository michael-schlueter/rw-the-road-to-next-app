import { Button } from "@/components/ui/button";
import { LucideCopy, LucideCopyCheck } from "lucide-react";
import { useState } from "react";

type CredentialCreatedToastProps = {
  secret: string;
};

export default function CredentialCreatedToast({
  secret,
}: CredentialCreatedToastProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(secret);
    setCopied(true);
  };

  return (
    <div className="flex flex-col w-full">
      <span>Copy the secret, we will not show it again</span>
      <div className="flex items-center gap-x-2">
        <span className="text-muted-foreground font-mono text-xs">
          {secret}
        </span>
        <Button size="icon" variant="ghost" onClick={handleCopy}>
          {copied ? (
            <LucideCopyCheck className="w-4 h-4" />
          ) : (
            <LucideCopy className="w-4 h-4" />
          )}
        </Button>
      </div>
    </div>
  );
}
