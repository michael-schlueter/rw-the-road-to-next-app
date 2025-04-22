import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

type EmailWelcomeProps = {
  toName: string;
  loginUrl: string;
};

export default function EmailWelcome({ toName, loginUrl }: EmailWelcomeProps) {
  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="font-sans m-8 text-center">
          <Container>
            <Section>
              <Text>
                Hello {toName}, welcome to{" "}
                <span className="font-bold">TicketBounty</span>!
              </Text>
            </Section>
            <Section>
              <Text>
                We are excited to have you join our community! You now have
                access to all your tickets and can create new ones.
              </Text>
            </Section>
            <Section>
              <Text>
                If you have any questions or need assistance, do not hesitate to
                reach out to our support team. We are here to help!
              </Text>
            </Section>
            <Section>
              <Button
                className="bg-black rounded text-white p-2 m-2"
                href={loginUrl}
              >
                Get Started
              </Button>
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

EmailWelcome.PreviewProps = {
  toName: "Michael Schlueter",
} as EmailWelcomeProps;
