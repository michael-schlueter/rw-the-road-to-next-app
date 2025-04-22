import { signInPath } from "@/paths";
import { getBaseUrl } from "@/utils/url";

export function generateLoginLink() {
  const loginLink = getBaseUrl() + signInPath();

  return loginLink;
}
