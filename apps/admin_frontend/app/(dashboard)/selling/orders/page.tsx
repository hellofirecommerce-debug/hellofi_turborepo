"use client";
import React, { useMemo, useState } from "react";
import { useQuery } from "@apollo/client/react";
import { PageHeader } from "../../../../components/ui/PageHeader";
import { SellingOrderFilterBar } from "./components/SellingOrderFilterBar";
import { SellingOrderTable } from "./components/SellingOrderTable";
import { OrderDetailsModal } from "./components/OrderDetailsModal";
import { DeviceReportModal } from "./components/DeviceReportModal";
import { UpdateStatusModal } from "./components/UpdateStatusModal";
import {
  AdminOrdersPage,
  AdminSellingOrder,
  DEFAULT_ORDER_FILTER,
  OrderFilterState,
} from "./types";
import { ORDER_STATUS_OPTIONS, buildFilterVariables } from "./helpers";
import {
  GET_ADMIN_ORDER_CITIES,
  GET_ADMIN_SELLING_ORDERS,
} from "../../../../lib/graphql/queries/sellingOrder.queries";

export default function SellingOrdersPage() {
  const [filter, setFilter] = useState<OrderFilterState>(DEFAULT_ORDER_FILTER);
  const [resetKey, setResetKey] = useState(0); // remounts the filter bar on Clear
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [detailsOrder, setDetailsOrder] = useState<AdminSellingOrder | null>(
    null,
  );
  const [reportOrder, setReportOrder] = useState<AdminSellingOrder | null>(
    null,
  );
  const [statusOrder, setStatusOrder] = useState<AdminSellingOrder | null>(
    null,
  );

  const variables = useMemo(
    () => buildFilterVariables(filter, page, pageSize),
    [filter, page, pageSize],
  );

  const { data, loading, refetch } = useQuery<{
    adminSellingOrders: AdminOrdersPage;
  }>(GET_ADMIN_SELLING_ORDERS, {
    variables,
    fetchPolicy: "cache-and-network",
  });

  const { data: citiesData } = useQuery<{ adminOrderCities: string[] }>(
    GET_ADMIN_ORDER_CITIES,
  );

  const result = data?.adminSellingOrders;

  // any filter change -> update instantly, go back to page 1
  const handleFilterChange = (patch: Partial<OrderFilterState>) => {
    setFilter((prev) => ({ ...prev, ...patch }));
    setPage(1);
  };

  const handleClear = () => {
    setFilter(DEFAULT_ORDER_FILTER);
    setPage(1);
    setResetKey((k) => k + 1);
  };

  return (
    <div>
      <PageHeader
        title="Selling Orders"
        breadcrumbs={[{ label: "Selling" }, { label: "Orders" }]}
      />

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">All Orders</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            {result?.total ?? 0} total orders
          </p>
        </div>

        <div className="p-4 border-b border-gray-100">
          <SellingOrderFilterBar
            key={resetKey}
            value={filter}
            cities={citiesData?.adminOrderCities ?? []}
            statuses={ORDER_STATUS_OPTIONS}
            onChange={handleFilterChange}
            onClear={handleClear}
          />
        </div>

        <SellingOrderTable
          data={result?.orders ?? []}
          total={result?.total ?? 0}
          currentPage={page}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setPage(1);
          }}
          onViewDetails={setDetailsOrder}
          onViewReport={setReportOrder}
          onUpdateStatus={setStatusOrder}
          loading={loading && !result}
        />
      </div>

      <OrderDetailsModal
        order={detailsOrder}
        onClose={() => setDetailsOrder(null)}
      />
      <DeviceReportModal
        order={reportOrder}
        onClose={() => setReportOrder(null)}
      />
      <UpdateStatusModal
        order={statusOrder}
        onClose={() => setStatusOrder(null)}
        onUpdated={() => refetch()}
      />
    </div>
  );
}
