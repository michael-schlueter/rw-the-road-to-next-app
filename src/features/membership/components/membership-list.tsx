import { getMemberships } from "../queries/get-memberships";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LucideBan, LucideCheck } from "lucide-react";

type MembershipListProps = {
  organizationId: string;
};

export default async function MembershipList({
  organizationId,
}: MembershipListProps) {
  const memberships = await getMemberships(organizationId);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Username</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Verified Email</TableHead>
          <TableHead />
        </TableRow>
      </TableHeader>
      <TableBody>
        {memberships.map((membership) => {
          const buttons = <></>; // TODO

          return (
            <TableRow key={membership.userId}>
              <TableCell>{membership.user.username}</TableCell>
              <TableCell>{membership.user.email}</TableCell>
              <TableCell>
                {membership.user.emailVerified ? (
                  <LucideCheck />
                ) : (
                  <LucideBan />
                )}
              </TableCell>
              <TableCell className="flex justify-end gap-x-2">
                {buttons}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
