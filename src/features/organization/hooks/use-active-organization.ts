import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Organization } from "@prisma/client";
import { getActiveOrganization } from "../queries/get-active-organization";

export function useActiveOrganization() {
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [isFetched, setIsFetched] = useState(false);

  const pathname = usePathname();

  useEffect(() => {
    async function fetchActiveOrganization() {
      const organization = await getActiveOrganization();
      setOrganization(organization);
      setIsFetched(true);
    }
    fetchActiveOrganization();
  }, [pathname]);

  return { organization, isFetched };
}
