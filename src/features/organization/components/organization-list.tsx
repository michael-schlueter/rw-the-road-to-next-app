import { getAuth } from "@/features/auth/queries/get-auth";
import React from "react";
import { getOrganizationsByUser } from "../queries/get-organizations-by-user";

export default async function OrganizationList() {
  const { user } = await getAuth();
  const organizations = await getOrganizationsByUser(user?.id);

  return (
    <div className="animate-fade-from-top">
      {organizations.map((organization) => (
        <div key={organization.id}>
          <div>Name: {organization.name}</div>
        </div>
      ))}
    </div>
  );
}
