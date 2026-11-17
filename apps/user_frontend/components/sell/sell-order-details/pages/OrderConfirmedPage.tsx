"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@apollo/client/react";
import { Home, Lock, Truck } from "lucide-react";
import { useAuthCheck } from "../../../auth/hooks/useAuthCheck";
import { AuthModal } from "../../../auth/AuthModal";
import { GET_ORDER_DETAILS } from "../../../../lib/graphql/queires/orderDetails.queries";
import type { ConfirmedOrder } from "../types";
import { ConfirmationHeader } from "../components/ConfirmationHeader";
import { OrderInfoCard } from "../components/OrderInfoCard";
import { WhatHappensNext } from "../components/WhatHappensNext";
import { OrderProductCard } from "../components/OrderProductCard";
import { HelpCard } from "../components/HelpCard";
import { ConditionReportCard } from "../components/ConditionReportCard";

interface Props {
  orderNo: string;
}

function Skeleton() {
  return (
    <div className="mx-auto w-full max-w-5xl animate-pulse px-4 py-10">
      <div className="mx-auto h-14 w-14 rounded-full bg-gray-200" />
      <div className="mx-auto mt-5 h-7 w-1/2 rounded bg-gray-200" />
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="h-64 rounded-xl bg-gray-100" />
        <div className="h-64 rounded-xl bg-gray-100" />
      </div>
    </div>
  );
}

export default function OrderConfirmedPage({ orderNo }: Props) {
  const [authOpen, setAuthOpen] = useState(false);
  const { isLoggedIn, loading: authLoading, refetch } = useAuthCheck();

  const { data, loading, error } = useQuery<any>(GET_ORDER_DETAILS, {
    variables: { orderNo },
    skip: !isLoggedIn,
    fetchPolicy: "network-only",
  });

  const order: ConfirmedOrder | undefined = data?.getSellingOrder;

  const shell = (children: React.ReactNode) => (
    <div className="min-h-dvh bg-[#F8FAFF]">
      {children}
      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        onSuccess={() => {
          setAuthOpen(false);
          refetch();
        }}
      />
    </div>
  );

  const message = (children: React.ReactNode) =>
    shell(<div className="mx-auto w-full max-w-xl px-4 py-10">{children}</div>);

  if (authLoading) return shell(<Skeleton />);

  if (!isLoggedIn) {
    return message(
      <div className="flex flex-col items-center rounded-2xl border border-blue-100 bg-white p-8 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#EEF3FF] text-[#0066FF]">
          <Lock size={22} />
        </span>
        <h2 className="mt-4 text-lg font-bold text-gray-900">
          Log in to view your order
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          For your safety, order details are only shown to the account that
          placed the order.
        </p>
        <button
          type="button"
          onClick={() => setAuthOpen(true)}
          className="mt-5 rounded-xl bg-[#0066FF] px-8 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/30 hover:bg-[#0057D9]"
        >
          Login / Signup
        </button>
      </div>,
    );
  }

  if (loading && !order) return shell(<Skeleton />);

  if (error || !order) {
    return message(
      <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-center">
        <p className="text-sm font-semibold text-red-600">
          We couldn&apos;t find this order on your account.
        </p>
      </div>,
    );
  }

  // checkout not finished yet → send the user back to complete it
  if (order.orderStatus === "AWAITING_ADDRESS") {
    return message(
      <div className="rounded-2xl border border-blue-100 bg-white p-8 text-center">
        <p className="text-sm font-semibold text-gray-900">
          This order isn&apos;t confirmed yet.
        </p>
        <Link
          href={`/sell/checkout/${order.orderNo}`}
          className="mt-4 inline-block text-sm font-bold text-[#0066FF]"
        >
          Complete checkout
        </Link>
      </div>,
    );
  }

  return shell(
    <>
      <ConfirmationHeader order={order} />

      <div className="mx-auto grid w-full max-w-5xl gap-6 px-4 py-8 lg:grid-cols-2">
        {/* left */}
        <div className="flex flex-col gap-6">
          <OrderInfoCard order={order} />
          <WhatHappensNext order={order} />

          <div className="flex flex-col gap-3">
            {/* TODO: point to your order-tracking page once it is built */}
            <Link
              href={`/sell/track/${order.orderNo}`}
              className="flex items-center justify-center gap-2 rounded-lg bg-[#0066FF] px-6 py-3.5 text-xs font-bold tracking-wide text-white shadow-lg shadow-blue-500/30 transition hover:bg-[#0057D9]"
            >
              <Truck size={14} />
              TRACK MY ORDER
            </Link>
            <Link
              href="/"
              className="flex items-center justify-center gap-2 rounded-lg bg-black px-6 py-3.5 text-xs font-bold tracking-wide text-white transition hover:bg-gray-900"
            >
              <Home size={14} />
              BACK TO HOME
            </Link>
          </div>
        </div>

        {/* right */}
        <div className="flex flex-col gap-6">
          <OrderProductCard
            productName={order.productName}
            variantName={order.variantName}
            productImage={order.productImage}
            totalAmount={order.totalAmount}
          />
          <HelpCard orderNo={order.orderNo} productName={order.productName} />
          <ConditionReportCard answers={order.answers ?? []} />
        </div>
      </div>
    </>,
  );
}
