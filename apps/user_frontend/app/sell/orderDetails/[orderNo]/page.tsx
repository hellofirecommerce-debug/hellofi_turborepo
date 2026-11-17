import OrderConfirmedPage from "../../../../components/sell/sell-order-details/pages/OrderConfirmedPage";

interface Props {
  params: Promise<{ orderNo: string }>;
}

export default async function Page({ params }: Props) {
  const { orderNo } = await params;
  return <OrderConfirmedPage orderNo={orderNo} />;
}
