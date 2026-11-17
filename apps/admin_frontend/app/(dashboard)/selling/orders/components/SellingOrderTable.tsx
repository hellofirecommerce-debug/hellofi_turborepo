"use client";
import React from "react";
import { ClipboardList, Eye, Pencil } from "lucide-react";
import { Table } from "../../../../../components/table/Table";
import { TableHeader } from "../../../../../components/table/TableHeader";
import { TableBody } from "../../../../../components/table/TableBody";
import { TableRow } from "../../../../../components/table/TableRow";
import { TableCell } from "../../../../../components/table/TableCell";
import { Pagination } from "../../../../../components/table/Pagination";
import { SkeletonRow } from "../../../../../components/ui/SkeletonRow";
import { AdminSellingOrder } from "../types";
import { formatCreatedAt, formatINR, orderTypeLabel } from "../helpers";

const COLS = 17;
const CDN = process.env.NEXT_PUBLIC_CDN_URL ?? "";

// column widths: change a number here to widen/narrow a column
const W = {
  sl: "min-w-[70px]",
  product: "min-w-[260px]",
  orderNo: "min-w-[210px]",
  brand: "min-w-[120px]",
  orderType: "min-w-[150px]",
  quotedSystem: "min-w-[170px]",
  quoted: "min-w-[140px]",
  progress: "min-w-[200px]",
  followup: "min-w-[120px]",
  fulfilled: "min-w-[150px]",
  created: "min-w-[230px]",
  imei: "min-w-[160px]",
  notes: "min-w-[220px]",
  invoice: "min-w-[100px]",
  details: "min-w-[100px]",
  report: "min-w-[140px]",
  status: "min-w-[240px]",
};

interface Props {
  data: AdminSellingOrder[];
  total: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onViewDetails: (order: AdminSellingOrder) => void;
  onViewReport: (order: AdminSellingOrder) => void;
  onUpdateStatus: (order: AdminSellingOrder) => void;
  loading?: boolean;
}

const progressClass = (s: string) =>
  s === "COMPLETED"
    ? "bg-green-100 text-green-700"
    : s === "CANCELLED"
      ? "bg-red-100 text-red-600"
      : "bg-blue-100 text-blue-700";

const iconBtn =
  "rounded-lg border border-gray-200 p-1.5 text-gray-500 hover:border-[rgb(33,76,123)] hover:text-[rgb(33,76,123)] hover:bg-blue-50";

export const SellingOrderTable: React.FC<Props> = ({
  data,
  total,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
  onViewDetails,
  onViewReport,
  onUpdateStatus,
  loading,
}) => (
  <div>
    <div
      className="overflow-x-auto overflow-y-auto w-full"
      style={{ maxHeight: "calc(100vh - 320px)" }}
    >
      <div className="min-w-[2650px]">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-white">
            <TableCell isHeader className={`${W.sl} whitespace-nowrap`}>
              Sl No.
            </TableCell>
            <TableCell isHeader className={`${W.product} whitespace-nowrap`}>
              Product Name
            </TableCell>
            <TableCell isHeader className={`${W.orderNo} whitespace-nowrap`}>
              Order No.
            </TableCell>
            <TableCell isHeader className={`${W.brand} whitespace-nowrap`}>
              Brand
            </TableCell>
            <TableCell isHeader className={`${W.orderType} whitespace-nowrap`}>
              Order Type
            </TableCell>
            <TableCell
              isHeader
              className={`${W.quotedSystem} whitespace-nowrap`}
            >
              Quoted Price By System
            </TableCell>
            <TableCell isHeader className={`${W.quoted} whitespace-nowrap`}>
              Quoted Price
            </TableCell>
            <TableCell isHeader className={`${W.progress} whitespace-nowrap`}>
              Order Progress
            </TableCell>
            <TableCell isHeader className={`${W.followup} whitespace-nowrap`}>
              Followup
            </TableCell>
            <TableCell isHeader className={`${W.fulfilled} whitespace-nowrap`}>
              Is Order Fulfilled
            </TableCell>
            <TableCell isHeader className={`${W.created} whitespace-nowrap`}>
              Created At
            </TableCell>
            <TableCell isHeader className={`${W.imei} whitespace-nowrap`}>
              IMEI / Serial
            </TableCell>
            <TableCell isHeader className={`${W.notes} whitespace-nowrap`}>
              Additional Notes
            </TableCell>
            <TableCell isHeader className={`${W.invoice} whitespace-nowrap`}>
              Invoice
            </TableCell>
            <TableCell isHeader className={`${W.details} whitespace-nowrap`}>
              Details
            </TableCell>
            <TableCell isHeader className={`${W.report} whitespace-nowrap`}>
              Device Report
            </TableCell>
            <TableCell isHeader className={`${W.status} whitespace-nowrap`}>
              Order Status
            </TableCell>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: pageSize }).map((_, i) => (
                <SkeletonRow key={i} colSpan={COLS} />
              ))
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={COLS}
                  className="text-center py-12 text-gray-400"
                >
                  No orders found
                </TableCell>
              </TableRow>
            ) : (
              data.map((o, i) => (
                <TableRow key={o.id}>
                  <TableCell className={W.sl}>
                    {(currentPage - 1) * pageSize + i + 1}
                  </TableCell>
                  <TableCell
                    className={`${W.product} font-medium text-gray-800`}
                  >
                    {o.productName}
                  </TableCell>
                  <TableCell
                    className={`${W.orderNo} whitespace-nowrap font-mono text-xs text-gray-600`}
                  >
                    {o.orderNo}
                  </TableCell>
                  <TableCell className={`${W.brand} text-gray-600`}>
                    {o.brandName}
                  </TableCell>
                  <TableCell
                    className={`${W.orderType} whitespace-nowrap text-gray-600`}
                  >
                    {orderTypeLabel(o)}
                  </TableCell>
                  <TableCell className={`${W.quotedSystem} whitespace-nowrap`}>
                    {formatINR(o.quotedPriceBySystem)}
                  </TableCell>
                  <TableCell className={`${W.quoted} whitespace-nowrap`}>
                    {formatINR(o.quotedPrice ?? o.totalAmount)}
                  </TableCell>
                  <TableCell className={W.progress}>
                    <span
                      className={`whitespace-nowrap rounded-full px-3 py-1 text-[11px] font-semibold ${progressClass(o.orderStatus)}`}
                    >
                      {o.orderStatus}
                    </span>
                  </TableCell>
                  <TableCell
                    className={`${W.followup} whitespace-nowrap text-gray-600`}
                  >
                    {o.followupStatus ?? "—"}
                    {o.followupCount > 0 && ` (${o.followupCount})`}
                  </TableCell>
                  <TableCell
                    className={`${W.fulfilled} whitespace-nowrap text-gray-600`}
                  >
                    {o.isFullFilled ? "Fulfilled" : "Pending"}
                  </TableCell>
                  <TableCell
                    className={`${W.created} whitespace-nowrap text-gray-600`}
                  >
                    {formatCreatedAt(o.createdAt)}
                  </TableCell>
                  <TableCell className={`${W.imei} text-gray-600`}>
                    {o.serialOrIMEI ?? "N/A"}
                  </TableCell>
                  <TableCell className={`${W.notes} text-gray-600`}>
                    {o.additionalNotes ?? "N/A"}
                  </TableCell>
                  <TableCell className={W.invoice}>
                    {o.invoiceLink ? (
                      <a
                        href={
                          o.invoiceLink.startsWith("http")
                            ? o.invoiceLink
                            : `${CDN}/${o.invoiceLink}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-[rgb(33,76,123)] underline hover:opacity-70"
                      >
                        View
                      </a>
                    ) : (
                      <span className="text-gray-400">N/A</span>
                    )}
                  </TableCell>
                  <TableCell className={W.details}>
                    <button
                      type="button"
                      onClick={() => onViewDetails(o)}
                      aria-label="View details"
                      className={iconBtn}
                    >
                      <Eye size={15} />
                    </button>
                  </TableCell>
                  <TableCell className={W.report}>
                    <button
                      type="button"
                      onClick={() => onViewReport(o)}
                      aria-label="View device report"
                      className={iconBtn}
                    >
                      <ClipboardList size={15} />
                    </button>
                  </TableCell>
                  <TableCell className={W.status}>
                    <div className="flex items-center gap-3">
                      <div className="text-xs">
                        <p className="whitespace-nowrap font-semibold text-gray-800">
                          {o.timelineLabel ?? "No timeline"}
                        </p>
                        {o.timelineUpdatedAt && (
                          <p className="text-gray-400">
                            {new Date(o.timelineUpdatedAt).toLocaleDateString(
                              "en-GB",
                              { timeZone: "Asia/Kolkata" },
                            )}
                          </p>
                        )}
                      </div>
                      {o.timelineName && (
                        <button
                          type="button"
                          onClick={() => onUpdateStatus(o)}
                          aria-label="Update status"
                          className={iconBtn}
                        >
                          <Pencil size={14} />
                        </button>
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
