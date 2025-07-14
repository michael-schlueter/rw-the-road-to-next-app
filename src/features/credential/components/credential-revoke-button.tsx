import useConfirmDialog from "@/components/confirm-dialog";
import { Button } from "@/components/ui/button";
import { LucideLoaderCircle, LucideTrash } from "lucide-react";
import { useRouter } from "next/navigation";

type CredentialRevokeButtonProps = {
  credentialId: string;
};

export default function CredentialRevokeButton({
  credentialId,
}: CredentialRevokeButtonProps) {
  const router = useRouter();

  const [revokeButton, revokeDialog] = useConfirmDialog({
    action: deleteCredential.bind(null, credentialId),
    loadingMessage: "Deleting credential...",
    trigger: (isPending) => (
      <Button variant="destructive" size="icon">
        {isPending ? (
          <LucideLoaderCircle className="w-4 h-4 animate-spin" />
        ) : (
          <LucideTrash className="w-4 h-4" />
        )}
      </Button>
    ),
    onSuccess: () => {
      router.refresh();
    },
  });
  return (
    <>
      {revokeDialog}
      {revokeButton}
    </>
  );
}
