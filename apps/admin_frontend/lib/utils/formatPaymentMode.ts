export function formatPaymentMode(paymentMode?: string | null): string {
  if (!paymentMode) return "—";
  const map: Record<string, string> = {
    CASH: "Cash",
    UPI: "UPI",
    CREDIT_CARD: "Credit Card",
    DEBIT_CARD: "Debit Card",
    SPLIT_PAYMENT: "Split Payment",
    RAZORPAY: "Razorpay",
  };
  return map[paymentMode] ?? paymentMode;
}
