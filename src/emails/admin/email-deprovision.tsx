import {
  Body,
  Container,
  Head,
  Html,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

type EmailDeprovisionProps = {
  user: string;
  organization: string;
};

export default function EmailDeprovision({
  user,
  organization,
}: EmailDeprovisionProps) {
  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="font-sans m-8 text-center">
          <Container>
            <Section>
              <Text>
                Hello {user}, your organization {organization} on TicketBounty
                exceeds its current member limit. Therefore we have removed excess invitations and members from your organization.
              </Text>
            </Section>
            <Section>
              <Text>
                Best regards,
                <br />
                <span className="font-bold">The TicketBounty Team</span>
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

EmailDeprovision.PreviewProps = {
  user: "Raulo",
  organization: "No Chance Club",
} as EmailDeprovisionProps;
