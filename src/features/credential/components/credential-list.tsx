import Placeholder from "@/components/placeholder";
import { getCredentials } from "../queries/get-credentials";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import CredentialRevokeButton from "./credential-revoke-button";
import clsx from "clsx";
import { Badge } from "@/components/ui/badge";

type CredentialListProps = {
  organizationId: string;
};

export default async function CredentialList({
  organizationId,
}: CredentialListProps) {
  const credentials = await getCredentials(organizationId);

  if (!credentials.length) {
    return <Placeholder label="No credentials for this organization" />;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Created At</TableHead>
          <TableHead>Last Used</TableHead>
          <TableHead>Created by</TableHead>
          <TableHead>Scopes</TableHead>
          <TableHead />
        </TableRow>
      </TableHeader>
      <TableBody>
        {credentials.map((credential) => {
          const revokeButton = (
            <CredentialRevokeButton
              credentialId={credential.id}
              organizationId={organizationId}
            />
          );

          const buttons = <>{revokeButton}</>;

          return (
            <TableRow key={credential.id}>
              <TableCell
                className={clsx({
                  "line-through": credential.revokedAt,
                })}
              >
                {credential.name}
              </TableCell>
              <TableCell>
                {format(credential.createdAt, "yyyy-MM-dd, HH:mm")}
              </TableCell>
              <TableCell>
                {credential.lastUsed
                  ? format(credential.lastUsed, "yyyy-MM-dd, HH:mm")
                  : "Never"}
              </TableCell>
              <TableCell>
                {credential.createdByUserId?.username ?? "Deleted user"}
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {credential.scopes.map((scope) => (
                    <Badge variant="secondary" key={scope.id}>
                      {scope.scope}
                    </Badge>
                  ))}
                </div>
              </TableCell>
              <TableCell>{buttons}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
