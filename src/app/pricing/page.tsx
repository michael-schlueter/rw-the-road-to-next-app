import { getActiveOrganization } from "@/features/organization/queries/get-active-organization";
import Products from "@/features/stripe/components/products";
import React from "react";

export default async function PricingPage() {
  const activeOrganization = await getActiveOrganization();

  return <Products organizationId={activeOrganization?.id} />;
}
