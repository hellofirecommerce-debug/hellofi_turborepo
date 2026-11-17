"use client";

import { useState } from "react";
import { useQuery } from "@apollo/client/react";
import { Lock } from "lucide-react";
import { useAuthCheck } from "../../../auth/hooks/useAuthCheck";
import { AuthModal } from "../../../auth/AuthModal";
import { GET_SELLING_ORDER } from "../../../../lib/graphql/queires/order.queries";
import { OrderOfferView } from "../components/OrderOfferView";

interface Props {
  orderNo: string;
}

function Skeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-gray-100 bg-white p-6">
      <div className="mx-auto h-12 w-12 rounded-full bg-gray-200" />
      <div className="mx-auto mt-4 h-6 w-2/3 rounded bg-gray-200" />
      <div className="mt-6 h-28 w-full rounded-xl bg-gray-100" />
      <div className="mt-4 h-4 w-3/4 rounded bg-gray-100" />
    </div>
  );
}

export function OrderDetailsPage({ orderNo }: Props) {
  const [authOpen, setAuthOpen] = useState(false);
  const { isLoggedIn, loading: authLoading, refetch } = useAuthCheck();

  // Only fetch once logged in. The backend also checks the order belongs to this user.
  const { data, loading, error } = useQuery<any>(GET_SELLING_ORDER, {
    variables: { orderNo },
    skip: !isLoggedIn,
    fetchPolicy: "network-only",
  });

  const order = data?.getSellingOrder;

  return (
    <div className="min-h-dvh bg-[#F8FAFF]">
      {authLoading ? (
        <div className="mx-auto w-full max-w-3xl px-4 py-10">
          <Skeleton />
        </div>
      ) : !isLoggedIn ? (
        <div className="mx-auto w-full max-w-3xl px-4 py-10">
          <div className="flex flex-col items-center rounded-2xl border border-blue-100 bg-white p-8 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#EEF3FF] text-[#0066FF]">
              <Lock size={22} />
            </span>
            <h2 className="mt-4 text-lg font-bold text-gray-900">
              Log in to view your offer
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              For your safety, offers are only shown to the account that placed
              the order.
            </p>
            <button
              type="button"
              onClick={() => setAuthOpen(true)}
              className="mt-5 rounded-xl bg-[#0066FF] px-8 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/30 hover:bg-[#0057D9]"
            >
              Login / Signup
            </button>
          </div>
        </div>
      ) : loading ? (
        <div className="mx-auto w-full max-w-3xl px-4 py-10">
          <Skeleton />
        </div>
      ) : error || !order ? (
        <div className="mx-auto w-full max-w-3xl px-4 py-10">
          <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-center">
            <p className="text-sm font-semibold text-red-600">
              We couldn't find this order on your account.
            </p>
            <p className="mt-1 text-xs text-red-500">
              Check the link, or log in with the mobile number you used to place
              the order.
            </p>
          </div>
        </div>
      ) : (
        <OrderOfferView order={order} />
      )}

      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        onSuccess={() => {
          setAuthOpen(false);
          refetch(); // re-check login → the order query then runs
        }}
      />
    </div>
  );
}
