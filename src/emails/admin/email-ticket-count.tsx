import {
  Body,
  Container,
  Head,
  Html,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

type EmailTicketCountProps = {
  count: string;
};

export default function EmailTicketCount({ count }: EmailTicketCountProps) {
  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="font-sans m-8 text-center">
          <Container>
            <Section>
              <Text>
                Hello Michael, in the last days there were {count} tickets
                created!
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

EmailTicketCount.PreviewProps = {
  count: "17",
} as EmailTicketCountProps;
