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

type EmailEmailResetProps = {
  toName: string;
  url: string;
};

export default function EmailEmailReset({ toName, url }: EmailEmailResetProps) {
  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="font-sans m-8 text-center">
          <Container>
            <Section>
              <Text>
                Hello {toName}, you have requested to reset your email. Click
                the button below to reset your email.
              </Text>
            </Section>
            <Section>
              <Button
                className="bg-black rounded text-white p-2 m-2"
                href={url}
              >
                Reset Email
              </Button>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

EmailEmailReset.PreviewProps = {
  toName: "Michael Schlueter",
  url: "http://localhost:3000/email-reset/abc-123",
} as EmailEmailResetProps;
