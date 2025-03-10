import React from "react";
import { getOrganizationsByUser } from "../queries/get-organizations-by-user";

export default async function OrganizationList() {
  const organizations = await getOrganizationsByUser();

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
