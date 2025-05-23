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
import MembershipDeleteButton from "./membership-delete-button";
import { format } from "date-fns";
import MembershipMoreMenu from "./membership-more-menu";
import PermissionToggle from "./permission-toggle";

type MembershipListProps = {
  organizationId: string;
};

export default async function MembershipList({
  organizationId,
}: MembershipListProps) {
  const { currentUserId, memberships } = await getMemberships(organizationId);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Username</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Joined At</TableHead>
          <TableHead>Verified Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Can Delete Ticket?</TableHead>
          <TableHead>Can Update Ticket?</TableHead>
          <TableHead />
        </TableRow>
      </TableHeader>
      <TableBody>
        {memberships.map((membership) => {
          const membershipMoreMenu = (
            <MembershipMoreMenu
              userId={membership.userId}
              organizationId={membership.organizationId}
              membershipRole={membership.membershipRole}
            />
          );

          const deleteButton = (
            <MembershipDeleteButton
              organizationId={membership.organizationId}
              userId={membership.userId}
            />
          );
          const buttons = (
            <>
              {membershipMoreMenu}
              {deleteButton}
            </>
          );

          return (
            <TableRow key={membership.userId}>
              <TableCell>
                {membership.user.username}{" "}
                {membership.userId === currentUserId ? <span title="That's you!" className="text-muted-foreground text-xs">(you)</span> : ""}
              </TableCell>
              <TableCell>{membership.user.email}</TableCell>
              <TableCell>
                {format(membership.joinedAt, "yyyy-MM-dd, HH:mm")}
              </TableCell>
              <TableCell>
                {membership.user.emailVerified ? (
                  <LucideCheck />
                ) : (
                  <LucideBan />
                )}
              </TableCell>
              <TableCell>{membership.membershipRole}</TableCell>
              <TableCell>
                {
                  <PermissionToggle
                    userId={membership.userId}
                    organizationId={membership.organizationId}
                    permissionKey="canDeleteTicket"
                    permissionValue={membership.canDeleteTicket}
                  />
                }
              </TableCell>
              <TableCell>
                {
                  <PermissionToggle
                    userId={membership.userId}
                    organizationId={membership.organizationId}
                    permissionKey="canUpdateTicket"
                    permissionValue={membership.canUpdateTicket}
                  />
                }
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
