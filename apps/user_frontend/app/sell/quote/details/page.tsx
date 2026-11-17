import { notFound } from "next/navigation";
import { OrderDetailsPage } from "../../../../components/sell/sell-order/pages/OrderDetailsPage";

interface Props {
  searchParams: Promise<{ orderId?: string }>;
}

export default async function Page({ searchParams }: Props) {
  const { orderId } = await searchParams;
  if (!orderId) notFound();

  return <OrderDetailsPage orderNo={orderId} />;
}
