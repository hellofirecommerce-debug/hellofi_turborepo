import { CheckoutPage } from "../../../../components/sell/sell-checkout/pages/CheckoutPage";

interface Props {
  params: Promise<{ orderNo: string }>;
}

export default async function Page({ params }: Props) {
  const { orderNo } = await params;
  return <CheckoutPage orderNo={orderNo} />;
}
