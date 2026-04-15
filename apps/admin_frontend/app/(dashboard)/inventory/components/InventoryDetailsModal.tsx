"use client";
import { Badge } from "@repo/ui";
import { InventoryProduct } from "../types";

const statusVariant: Record<string, "success" | "warning" | "error"> = {
  LISTED: "success",
  NOT_LISTED: "warning",
  SOLD: "error",
};

const statusLabel: Record<string, string> = {
  LISTED: "Listed",
  NOT_LISTED: "Not Listed",
  SOLD: "Sold",
};

const conditionLabel: Record<string, string> = {
  NO: "No",
  MINOR: "Minor",
  MAJOR: "Major",
};

const conditionVariant: Record<string, string> = {
  NO: "text-green-600 bg-green-50 border-green-200",
  MINOR: "text-yellow-600 bg-yellow-50 border-yellow-200",
  MAJOR: "text-red-600 bg-red-50 border-red-200",
};

const paymentModeLabel: Record<string, string> = {
  CASH: "Cash",
  UPI: "UPI",
  CREDIT_CARD: "Credit Card",
  DEBIT_CARD: "Debit Card",
  SPLIT_PAYMENT: "Split Payment",
  RAZORPAY: "Razorpay",
};

interface InventoryDetailsModalProps {
  product: InventoryProduct | null;
  onClose: () => void;
}

const fmt = (val?: string | null) =>
  val
    ? new Date(val).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";

const money = (val?: number | null) =>
  val != null ? `₹${Number(val).toLocaleString("en-IN")}` : "—";

const dash = (val?: string | null) => val || "—";

const Field: React.FC<{
  label: string;
  value: React.ReactNode;
  span?: boolean;
}> = ({ label, value, span }) => (
  <div className={`flex flex-col gap-0.5 ${span ? "col-span-2" : ""}`}>
    <span className="text-xs text-gray-400">{label}</span>
    <span className="font-medium text-gray-800 text-sm">{value}</span>
  </div>
);

export const InventoryDetailsModal: React.FC<InventoryDetailsModalProps> = ({
  product,
  onClose,
}) => {
  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-start justify-between rounded-t-2xl">
          <div>
            <h2 className="text-base font-semibold text-gray-900">
              {product?.productName}
              {(product?.ram || product?.storage) && (
                <span className="text-gray-500 font-normal ml-1 text-sm">
                  ({[product?.ram, product?.storage].filter(Boolean).join("/")})
                </span>
              )}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5 font-mono">
              {product.orderId} · {product.imeiOrSerial}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge
              variant={statusVariant[product.status] ?? "default"}
              size="sm"
            >
              {statusLabel[product.status] ?? product.status}
            </Badge>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors text-xl leading-none"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6 flex flex-col gap-6">
          {/* Purchase Details */}
          <section>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Purchase Details
            </h3>
            <div className="grid grid-cols-2 gap-x-6 gap-y-3">
              <Field label="Brand" value={product.brand?.name} />
              <Field label="Category" value={product.category?.name} />
              <Field label="Purchase Date" value={fmt(product.purchaseDate)} />
              <Field label="Cost Price" value={money(product.costPrice)} />
              <Field
                label="Other Charges"
                value={money(product.otherCharges)}
              />
              {(product as any).ram && (
                <Field label="RAM" value={(product as any).ram} />
              )}
              {(product as any).storage && (
                <Field label="Storage" value={(product as any).storage} />
              )}
              {product.notes && (
                <Field label="Notes" value={product.notes} span />
              )}
            </div>
          </section>

          {/* Device Condition */}
          <section>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Device Condition
            </h3>
            <div className="grid grid-cols-2 gap-x-6 gap-y-3">
              <div className="flex flex-col gap-0.5">
                <span className="text-xs text-gray-400">Screen Condition</span>
                <span
                  className={`inline-flex w-fit px-2 py-0.5 rounded border text-xs font-medium ${conditionVariant[product.screenCondition] ?? ""}`}
                >
                  {conditionLabel[product.screenCondition] ??
                    product.screenCondition}
                </span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-xs text-gray-400">Body Condition</span>
                <span
                  className={`inline-flex w-fit px-2 py-0.5 rounded border text-xs font-medium ${conditionVariant[product.bodyCondition] ?? ""}`}
                >
                  {conditionLabel[product.bodyCondition] ??
                    product.bodyCondition}
                </span>
              </div>
              <Field label="Device Issues" value={dash(product.deviceIssues)} />
              <div className="flex flex-col gap-0.5">
                <span className="text-xs text-gray-400">Accessories</span>
                <div className="flex flex-wrap gap-1">
                  {product.hasBox && (
                    <span className="px-2 py-0.5 bg-blue-50 border border-blue-200 text-blue-700 rounded text-xs">
                      Box
                    </span>
                  )}
                  {product.hasCharger && (
                    <span className="px-2 py-0.5 bg-blue-50 border border-blue-200 text-blue-700 rounded text-xs">
                      Charger
                    </span>
                  )}
                  {product.hasOriginalBill && (
                    <span className="px-2 py-0.5 bg-blue-50 border border-blue-200 text-blue-700 rounded text-xs">
                      Original Bill
                    </span>
                  )}
                  {!product.hasBox &&
                    !product.hasCharger &&
                    !product.hasOriginalBill && (
                      <span className="text-gray-400 text-sm">None</span>
                    )}
                </div>
              </div>
              <Field
                label="Warranty"
                value={`${product.warrantyType === "ABOVE_1_YEAR" ? "Above 1 Year" : "Below 1 Year"}${
                  product.warrantyType === "BELOW_1_YEAR" &&
                  product.warrantyPurchaseDate
                    ? ` (Purchased: ${fmt(product.warrantyPurchaseDate)})`
                    : ""
                }`}
              />
            </div>
          </section>

          {/* Purchase Customer */}
          <section>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Purchase Customer
              <span className="ml-1 font-normal normal-case text-gray-400">
                (Who sold to us)
              </span>
            </h3>
            <div className="grid grid-cols-2 gap-x-6 gap-y-3">
              <Field label="Name" value={dash(product.customerName)} />
              <Field label="Phone" value={dash(product.customerPhone)} />
              <Field label="Email" value={dash(product.customerEmail)} />
              <Field
                label="Address"
                value={dash(product.customerAddress)}
                span
              />
            </div>
          </section>

          {/* Selling Details */}
          <section>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Selling Details
              <span className="ml-1 font-normal normal-case text-gray-400">
                (Who bought from us)
              </span>
            </h3>
            {product.status !== "SOLD" ? (
              <p className="text-sm text-gray-400 italic">Not sold yet</p>
            ) : (
              <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                <Field label="Selling Date" value={fmt(product.sellingDate)} />
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs text-gray-400">Selling Price</span>
                  <span className="font-medium text-green-600 text-sm">
                    {money(product.sellingPrice)}
                  </span>
                </div>

                <Field
                  label="Payment Mode"
                  value={
                    product.paymentMode
                      ? (paymentModeLabel[product.paymentMode] ??
                        product.paymentMode)
                      : "—"
                  }
                />
                <Field
                  label="Received in Bank"
                  value={money(product.receivedInBank)}
                />
                <Field
                  label="Selling Other Charges"
                  value={money((product as any).sellingOtherCharges)}
                />
                <Field
                  label="TAT"
                  value={product.tat != null ? `${product.tat} days` : "—"}
                />
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs text-gray-400">Gross Profit</span>
                  <span
                    className={`font-semibold text-sm ${(product.grossProfit ?? 0) >= 0 ? "text-green-600" : "text-red-500"}`}
                  >
                    {money(product.grossProfit)}
                  </span>
                </div>
                {product.splitPaymentDetails && (
                  <Field
                    label="Split Payment Details"
                    value={product.splitPaymentDetails}
                    span
                  />
                )}
                <Field
                  label="Buyer Name"
                  value={dash(product.sellingCustomerName)}
                />
                <Field
                  label="Buyer Phone"
                  value={dash(product.sellingCustomerPhone)}
                />
                <Field
                  label="Buyer Email"
                  value={dash(product.sellingCustomerEmail)}
                />
                <Field
                  label="Buyer Address"
                  value={dash(product.sellingCustomerAddress)}
                  span
                />
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};
