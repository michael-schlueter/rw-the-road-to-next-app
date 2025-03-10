import React from "react";
import { getOrganizationsByUser } from "../queries/get-organizations-by-user";
import { format } from "date-fns";

export default async function OrganizationList() {
  const organizations = await getOrganizationsByUser();

  return (
    <div className="animate-fade-from-top">
      {organizations.map((organization) => (
        <div key={organization.id}>
          <div>Name: {organization.name}</div>
          <div>
            Joined At:{" "}
            {format(organization.membershipByUser.joinedAt, "yyyy-MM, HH:mm")}
          </div>
          <div>Members: {organization._count.memberships}</div>
        </div>
      ))}
    </div>
  );
}
