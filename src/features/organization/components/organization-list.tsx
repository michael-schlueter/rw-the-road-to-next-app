import React from "react";
import { getOrganizationsByUser } from "../queries/get-organizations-by-user";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  LucideArrowLeftRight,
  LucideArrowUpRightFromSquare,
  LucidePen,
} from "lucide-react";
import OrganizationSwitchButton from "./organization-switch-button";
import SubmitButton from "@/components/form/submit-button";
import OrganizationDeleteButton from "./organization-delete-button";
import Link from "next/link";
import { membershipsPath } from "@/paths";
import MembershipDeleteButton from "@/features/membership/components/membership-delete-button";

type OrganizationListProps = {
  limitedAccess?: boolean;
};

export default async function OrganizationList({
  limitedAccess,
}: OrganizationListProps) {
  const organizations = await getOrganizationsByUser();

  // Check if user has active organization
  const hasActive = organizations.some((organization) => {
    return organization.membershipByUser.isActive;
  });

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Joined At</TableHead>
          <TableHead>Members</TableHead>
          <TableHead />
        </TableRow>
      </TableHeader>
      <TableBody>
        {organizations.map((organization) => {
          const isActive = organization.membershipByUser.isActive;
          const switchButton = (
            <OrganizationSwitchButton
              organizationId={organization.id}
              trigger={
                <SubmitButton
                  icon={<LucideArrowLeftRight />}
                  label={
                    !hasActive ? "Activate" : isActive ? "Active" : "Switch"
                  }
                  variant={
                    !hasActive ? "secondary" : isActive ? "default" : "outline"
                  }
                />
              }
            />
          );

          const detailButton = (
            <Button variant="outline" size="icon" asChild>
              <Link href={membershipsPath(organization.id)}>
                <LucideArrowUpRightFromSquare className="w-4 h-4" />
              </Link>
            </Button>
          );

          const editButton = (
            <Button variant="outline" size="icon">
              <LucidePen className="w-4 h-4" />
            </Button>
          );

          const deleteButton = (
            <OrganizationDeleteButton organizationId={organization.id} />
          );

          const leaveButton = (
            <MembershipDeleteButton
              organizationId={organization.membershipByUser.organizationId}
              userId={organization.membershipByUser.userId}
            />
          );

          const buttons = (
            <>
              {switchButton}
              {limitedAccess ? null : detailButton}
              {limitedAccess ? null : editButton}
              {limitedAccess ? null : leaveButton}
              {limitedAccess ? null : deleteButton}
            </>
          );

          return (
            <TableRow key={organization.id}>
              <TableCell>{organization.id}</TableCell>
              <TableCell>{organization.name}</TableCell>
              <TableCell>
                {format(
                  organization.membershipByUser.joinedAt,
                  "yyyy-MM-dd, HH:mm"
                )}
              </TableCell>
              <TableCell>{organization._count.memberships}</TableCell>
              <TableCell>
                {organization.membershipByUser.membershipRole}
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
