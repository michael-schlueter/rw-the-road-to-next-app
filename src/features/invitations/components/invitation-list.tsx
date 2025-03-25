import Placeholder from "@/components/placeholder";
import { getInvitations } from "../queries/get-invitations";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import InvitationDeleteButton from "./invitation-delete-button";

type InvitationListProps = {
  organizationId: string;
};

export default async function InvitationList({
  organizationId,
}: InvitationListProps) {
  const invitations = await getInvitations(organizationId);

  if (!invitations.length) {
    return <Placeholder label="No invitation for this organization" />;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Email</TableHead>
          <TableHead>Invited At</TableHead>
          <TableHead>Invited By</TableHead>
          <TableHead />
        </TableRow>
      </TableHeader>
      <TableBody>
        {invitations.map((invitation) => {
          const deleteButton = (
            <InvitationDeleteButton
              organizationId={invitation.organizationId}
              email={invitation.email}
            />
          );

          const buttons = <>{deleteButton}</>;

          return (
            <TableRow key={invitation.email}>
              <TableCell>{invitation.email}</TableCell>
              <TableCell>
                {format(invitation.createdAt, "yyyy-MM-dd, HH:mm")}
              </TableCell>
              <TableCell>
                {invitation.invitedByUser
                  ? `${invitation.invitedByUser.username} (${invitation.invitedByUser.email})`
                  : "Deleted user"}
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
