import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { stripe } from "@/lib/stripe";
import { toCurrencyFromCent } from "@/utils/currency";
import { LucideBadgeCheck, LucideCheck } from "lucide-react";
import CheckoutSessionForm from "./checkout-session-form";
import { getStripeCustomberByOrganization } from "../queries/get-stripe-customer";
import { isActiveSubscription } from "../utils/is-active-subscription";

type PricesProps = {
  organizationId: string | null | undefined;
  productId: string;
  activePriceId: string | null | undefined;
};

async function Prices({
  organizationId,
  productId,
  activePriceId,
}: PricesProps) {
  const prices = await stripe.prices.list({
    active: true,
    product: productId,
  });

  return (
    <div className="flex gap-x-2">
      {prices.data.map((price) => (
        <CheckoutSessionForm
          key={price.id}
          organizationId={organizationId}
          priceId={price.id}
          activePriceId={activePriceId}
        >
          <span className="font-bold text-lg">
            {toCurrencyFromCent(price.unit_amount || 0, price.currency)}
          </span>
          &nbsp;/&nbsp;<span>{price.recurring?.interval}</span>
        </CheckoutSessionForm>
      ))}
    </div>
  );
}

type ProductsProps = {
  organizationId: string | null | undefined;
};

export default async function Products({ organizationId }: ProductsProps) {
  const stripeCustomer = await getStripeCustomberByOrganization(organizationId);

  const activeSubscription = isActiveSubscription(stripeCustomer);
  const activeProductId = activeSubscription ? stripeCustomer?.productId : null;
  const activePriceId = activeSubscription ? stripeCustomer?.priceId : null;

  const products = await stripe.products.list({
    active: true,
  });

  return (
    <div className="flex-1 flex justify-center items-center gap-x-4">
      {products.data.map((product) => (
        <Card key={product.id}>
          <CardHeader>
            <CardTitle className="flex justify-between">
              {product.name}
              {activeProductId === product.id ? <LucideBadgeCheck /> : null}
            </CardTitle>
            <CardDescription>{product.description}</CardDescription>
          </CardHeader>
          <CardContent>
            {product.marketing_features.map((feature) => (
              <div key={feature.name} className="flex gap-x-2">
                <LucideCheck /> {feature.name}
              </div>
            ))}
          </CardContent>
          <CardFooter>
            <Prices
              organizationId={organizationId}
              productId={product.id}
              activePriceId={activePriceId}
            />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
