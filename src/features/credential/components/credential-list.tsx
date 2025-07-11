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
          <TableHead />
        </TableRow>
      </TableHeader>
      <TableBody>
        {credentials.map((credential) => {
          const buttons = <></>; // TODO: add revoke credential button

          return (
            <TableRow key={credential.id}>
              <TableCell>{credential.name}</TableCell>
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
              <TableCell>{buttons}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
