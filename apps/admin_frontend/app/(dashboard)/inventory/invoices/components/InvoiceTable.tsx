"use client";
import React from "react";
import { pdf } from "@react-pdf/renderer";
import { Download, X, CheckCircle, Pen } from "lucide-react";
import { Button } from "@repo/ui";
import { Table } from "../../../../../components/table/Table";
import { TableHeader } from "../../../../../components/table/TableHeader";
import { TableBody } from "../../../../../components/table/TableBody";
import { TableRow } from "../../../../../components/table/TableRow";
import { TableCell } from "../../../../../components/table/TableCell";
import { Pagination } from "../../../../../components/table/Pagination";
import {
  InvoiceType,
  InvoiceItemType,
  InvoiceExchangeItemType,
} from "../types";

interface InvoiceTableProps {
  data: InvoiceType[];
  total: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onEdit: (id: string) => void;
  onCancel: (id: string) => void;
  onFinalize: (id: string) => void;
}

const statusColors: Record<string, string> = {
  DRAFT: "bg-yellow-50 text-yellow-700 border-yellow-200",
  FINALIZED: "bg-green-50 text-green-700 border-green-200",
  CANCELLED: "bg-red-50 text-red-700 border-red-200",
};

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString("en-GB");

const formatCurrency = (amount: number) =>
  `₹${amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;

export const InvoiceTable: React.FC<InvoiceTableProps> = ({
  data,
  total,
  currentPage,
  pageSize,
  totalPages,
  onPageChange,
  onPageSizeChange,
  onEdit,
  onCancel,
  onFinalize,
}) => {
  const handleDownload = async (invoice: InvoiceType) => {
    const { InvoiceDocument } =
      await import("../create/components/InvoiceDocument");

    const invoiceData = {
      invoiceNumber: invoice.invoiceNumber,
      date: invoice.invoiceDate,
      companySettingsId: invoice.companySettingsId,
      billingAddress: {
        name: invoice.clientName,
        address: invoice.clientAddress,
        email: invoice.clientEmail,
        contactNumber: invoice.clientContact,
        gstNumber: invoice.clientGstin ?? "",
        isInsideBangalore: invoice.isInsideBangalore,
        paidBy: invoice.paidBy ?? "",
      },
      invoiceDetails: {
        invoiceNumber: invoice.invoiceNumber,
        invoiceDate: invoice.invoiceDate,
      },
      warrantyType: invoice.warrantyType.toLowerCase() as
        | "brand"
        | "hellofi"
        | "none",
      warrantyMonths: invoice.warrantyMonths ?? null,
      saleType: invoice.saleType.toLowerCase() as "direct" | "exchange",
      items: invoice.items.map((item: InvoiceItemType) => ({
        id: item.id,
        product: item.product,
        serialNumber: item.serialNumber ?? "",
        hsnSac: item.hsnSac ?? "",
        qty: item.qty,
        uom: item.uom,
        rate: item.rate,
        total: item.total,
        discount: item.discount,
        gstAmount: item.gstAmount,
        gross: item.gross,
      })),
      exchangeItems: invoice.exchangeItems.map(
        (ex: InvoiceExchangeItemType) => ({
          id: ex.id,
          productName: ex.productName,
          serialNumber: ex.serialNumber ?? "",
        }),
      ),
      exchangeValue: invoice.exchangeValue,
      gstCalculation: {
        cgst: invoice.cgst,
        sgst: invoice.sgst,
        igst: invoice.igst,
        total: invoice.taxAmount,
      },
      grossValue: invoice.grossValue,
      taxAmount: invoice.taxAmount,
      totalAmount: invoice.totalAmount,
      amountPaid: invoice.amountPaid,
      additionalInfo: {
        invoiceTerms: invoice.customInvoiceTerms ?? "",
        bankDetails: invoice.customBankDetails ?? "",
      },
    };

    const blob = await pdf(
      <InvoiceDocument
        data={invoiceData as any}
        selectedSettings={invoice.companySettings as any}
      />,
    ).toBlob();

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${invoice.invoiceNumber}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="overflow-x-auto w-full">
        <div className="min-w-[1400px] min-h-[400px]">
          <Table>
            <TableHeader>
              <TableCell isHeader className="min-w-[180px]">
                Invoice Number
              </TableCell>
              <TableCell isHeader className="min-w-[120px]">
                Date
              </TableCell>
              <TableCell isHeader className="min-w-[180px]">
                Client Name
              </TableCell>
              <TableCell isHeader className="min-w-[140px]">
                Contact
              </TableCell>
              <TableCell isHeader className="min-w-[120px]">
                Sale Type
              </TableCell>
              <TableCell isHeader className="min-w-[130px]">
                Total Amount
              </TableCell>
              <TableCell isHeader className="min-w-[130px]">
                Amount Paid
              </TableCell>
              <TableCell isHeader className="min-w-[100px]">
                Status
              </TableCell>
              <TableCell isHeader className="min-w-[180px]">
                Actions
              </TableCell>
            </TableHeader>
            <TableBody>
              {data.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className="text-center py-12 text-gray-400"
                  >
                    No invoices found
                  </TableCell>
                </TableRow>
              ) : (
                data.map((invoice: InvoiceType) => (
                  <TableRow key={invoice.id}>
                    <TableCell>
                      <span className="font-medium text-[rgb(33,76,123)] text-sm">
                        {invoice.invoiceNumber}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-600">
                        {formatDate(invoice.invoiceDate)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-800">
                          {invoice.clientName}
                        </span>
                        <span className="text-xs text-gray-400">
                          {invoice.clientEmail}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-600">
                        {invoice.clientContact}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded-full border ${
                          invoice.saleType === "EXCHANGE"
                            ? "bg-orange-50 text-orange-700 border-orange-200"
                            : "bg-green-50 text-green-700 border-green-200"
                        }`}
                      >
                        {invoice.saleType}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm font-medium text-gray-800">
                        {formatCurrency(invoice.totalAmount)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm font-medium text-gray-800">
                        {formatCurrency(invoice.amountPaid)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded-full border ${statusColors[invoice.status]}`}
                      >
                        {invoice.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        {/* Download — always available */}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDownload(invoice)}
                          className="h-8 w-8 border border-gray-200 text-gray-500 hover:border-[rgb(33,76,123)] hover:text-[rgb(33,76,123)] hover:bg-blue-50"
                          title="Download PDF"
                        >
                          <Download size={14} />
                        </Button>

                        {/* Edit — only DRAFT */}
                        {invoice.status === "DRAFT" && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onEdit(invoice.id)}
                            className="h-8 w-8 border border-gray-200 text-gray-500 hover:border-[rgb(33,76,123)] hover:text-[rgb(33,76,123)] hover:bg-blue-50"
                            title="Edit Invoice"
                          >
                            <Pen size={14} />
                          </Button>
                        )}

                        {/* Finalize — only DRAFT */}
                        {invoice.status === "DRAFT" && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onFinalize(invoice.id)}
                            className="h-8 w-8 border border-gray-200 text-gray-500 hover:border-green-400 hover:text-green-600 hover:bg-green-50"
                            title="Finalize Invoice"
                          >
                            <CheckCircle size={14} />
                          </Button>
                        )}

                        {/* Cancel — DRAFT and FINALIZED only */}
                        {invoice.status !== "CANCELLED" && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onCancel(invoice.id)}
                            className="h-8 w-8 border border-gray-200 text-gray-500 hover:border-red-300 hover:text-red-500 hover:bg-red-50"
                            title="Cancel Invoice"
                          >
                            <X size={14} />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <Pagination
        currentPage={currentPage}
        totalItems={total}
        pageSize={pageSize}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />
    </div>
  );
};
