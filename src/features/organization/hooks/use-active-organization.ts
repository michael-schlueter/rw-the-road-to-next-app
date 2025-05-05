import { getActiveOrganization } from "../queries/get-active-organization";
import { useQuery } from "@tanstack/react-query";

export const ACTIVE_ORGANIZATION_QUERY_KEY = ["activeOrganization"];

export function useActiveOrganization() {
  const { data: organization, isFetched } = useQuery({
    queryKey: ACTIVE_ORGANIZATION_QUERY_KEY,
    queryFn: getActiveOrganization,
  });

  return { organization, isFetched };
}
