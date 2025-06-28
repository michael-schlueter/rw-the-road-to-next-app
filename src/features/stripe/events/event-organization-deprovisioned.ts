import { inngest } from "@/lib/inngest";
import sendEmailDeprovision from "../emails/send-email-deprovision";

export type OrganizationDeprovisionedEventArgs = {
  data: {
    username: string;
    organizationName: string;
    email: string;
  };
};

export const deprovisionOrganizationEvent = inngest.createFunction(
  { id: "send-deprovision-notification-email" },
  { event: "app/organization.deprovisioned" },
  async ({ event }) => {
    const { username, organizationName, email } = event.data;

    const result = await sendEmailDeprovision(
      username,
      organizationName,
      email,
    );

    if (result.error) {
      throw new Error(`${result.error.name}: ${result.error.message}`);
    }

    return { event, body: true };
  }
);
