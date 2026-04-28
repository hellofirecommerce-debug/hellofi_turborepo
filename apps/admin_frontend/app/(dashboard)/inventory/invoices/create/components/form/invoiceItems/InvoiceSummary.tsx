"use client";
import { InvoiceData } from "../../../page";

interface Props {
  grossValue: number;
  gstCalculation: InvoiceData["gstCalculation"];
  totalAmount: number;
  exchangeValue: number;
  amountPaid: number;
  saleType: "direct" | "exchange";
  isInsideBangalore: boolean;
}

export function InvoiceSummary({
  grossValue,
  gstCalculation,
  totalAmount,
  exchangeValue,
  amountPaid,
  saleType,
  isInsideBangalore,
}: Props) {
  return (
    <div className="bg-blue-50 rounded-lg p-3 flex flex-col gap-1.5 border border-blue-100">
      <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
        Invoice Summary
      </p>
      <div className="flex justify-between text-sm">
        <span className="text-gray-500">Gross Value</span>
        <span className="font-medium">
          ₹{grossValue.toLocaleString("en-IN")}
        </span>
      </div>
      {isInsideBangalore ? (
        <>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">CGST (9%)</span>
            <span className="font-medium">
              ₹{gstCalculation.cgst.toLocaleString("en-IN")}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">SGST (9%)</span>
            <span className="font-medium">
              ₹{gstCalculation.sgst.toLocaleString("en-IN")}
            </span>
          </div>
        </>
      ) : (
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">IGST (18%)</span>
          <span className="font-medium">
            ₹{gstCalculation.igst.toLocaleString("en-IN")}
          </span>
        </div>
      )}
      <div className="flex justify-between text-sm font-semibold border-t border-blue-200 pt-1.5 mt-0.5">
        <span>Total Amount</span>
        <span className="text-green-600">
          ₹{totalAmount.toLocaleString("en-IN")}
        </span>
      </div>
      {saleType === "exchange" && (
        <>
          <div className="flex justify-between text-sm text-orange-600">
            <span>Exchange Value</span>
            <span>- ₹{exchangeValue.toLocaleString("en-IN")}</span>
          </div>
          <div className="flex justify-between text-sm font-semibold border-t border-blue-200 pt-1.5 mt-0.5">
            <span>Amount to be Paid</span>
            <span className="text-blue-600">
              ₹{amountPaid.toLocaleString("en-IN")}
            </span>
          </div>
        </>
      )}
    </div>
  );
}
