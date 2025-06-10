import CheckoutSessionForm from "./checkout-session-form";
import UpdateSubscriptionButton from "./update-subscription-button";

type SubscriptionOptionsProps = {
  organizationId: string | null | undefined;
  priceId: string;
  activePriceId: string | null | undefined;
  children: React.ReactNode;
};

export default function SubscriptionOptions({
  organizationId,
  priceId,
  activePriceId,
  children,
}: SubscriptionOptionsProps) {
  if (!activePriceId) {
    return (
      <CheckoutSessionForm organizationId={organizationId} priceId={priceId}>
        {children}
      </CheckoutSessionForm>
    );
  } else {
    return (
      <UpdateSubscriptionButton
        organizationId={organizationId}
        priceId={priceId}
        activePriceId={activePriceId}
      >
        {children}
      </UpdateSubscriptionButton>
    );
  }
}