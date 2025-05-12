"use client"

import { useQueryState } from "nuqs";
import { orgFilterOptions, orgFilterParser } from "../search-params";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function TicketOrgFilterSwitch() {
  const [orgOnly, setOrgOnly] = useQueryState(
    "orgOnly",
    orgFilterParser.withOptions(orgFilterOptions)
  );

  return (
    <div className="flex items-center space-x-2 pt-2">
      <Switch
        id="org-filter"
        checked={orgOnly ?? false}
        onCheckedChange={setOrgOnly}
      />
      <Label htmlFor="org-filter">Show tickets by active organization</Label>
    </div>
  );
}
