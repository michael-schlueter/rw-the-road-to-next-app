import { MyBig } from "@/lib/big";

export function toCent(amount: number) {
  return new MyBig(amount).mul(100).round(2).toNumber();
}

export function fromCent(amount: number) {
  return new MyBig(amount).div(100).round(2).toNumber();
}

export function toCurrencyFromCent(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(fromCent(amount));
}
