"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "@apollo/client/react";
import { Banknote, CalendarDays, Lock, MapPin } from "lucide-react";
import { useAuthCheck } from "../../../auth/hooks/useAuthCheck";
import { AuthModal } from "../../../auth/AuthModal";
import {
  GET_CHECKOUT_ORDER,
  GET_MY_ADDRESSES,
} from "../../../../lib/graphql/queires/checkout.queries";
import { PLACE_SELLING_ORDER } from "../../../../lib/graphql/mutations/checkout.mutations";
import type {
  Address,
  AreaInfo,
  CheckoutOrder,
  PaymentDraft,
  ScheduleDraft,
} from "../types";
import DeviceBar from "../components/DeviceBar";
import EstimatedValueCard from "../components/EstimatedValueCard";
import StepCard from "../components/StepCard";
import AddressStep from "../components/AddressStep";
import SchedulePickupStep from "../components/SchedulePickupStep";
import PaymentStep from "../components/PaymentStep";

interface Props {
  orderNo: string;
}

const PAYMENT_LABEL: Record<PaymentDraft["method"], string> = {
  UPI: "UPI Transfer",
  BANK: "Bank Transfer",
  CASH: "Cash",
};

const formatDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  });

function Skeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-14 rounded-xl bg-gray-200" />
      <div className="h-48 rounded-xl bg-gray-100" />
      <div className="h-14 rounded-xl bg-gray-100" />
      <div className="h-14 rounded-xl bg-gray-100" />
    </div>
  );
}

export function CheckoutPage({ orderNo }: Props) {
  const router = useRouter();
  const [authOpen, setAuthOpen] = useState(false);

  // ---------- checkout draft: everything lives here until the final call ----------
  const [address, setAddress] = useState<Address | null>(null);
  const [area, setArea] = useState<AreaInfo | null>(null);
  const [schedule, setSchedule] = useState<ScheduleDraft | null>(null);
  const [payment, setPayment] = useState<PaymentDraft | null>(null);
  const [agreed, setAgreed] = useState(false);

  const [openStep, setOpenStep] = useState<number>(1); // 0 = all closed
  const [redirecting, setRedirecting] = useState(false);
  const [placeError, setPlaceError] = useState<string | null>(null);

  const {
    isLoggedIn,
    loading: authLoading,
    refetch: refetchAuth,
  } = useAuthCheck();

  const {
    data: orderData,
    loading: orderLoading,
    error: orderError,
  } = useQuery<any>(GET_CHECKOUT_ORDER, {
    variables: { orderNo },
    skip: !isLoggedIn,
    fetchPolicy: "network-only",
  });

  const { data: addrData, refetch: refetchAddresses } = useQuery<any>(
    GET_MY_ADDRESSES,
    { skip: !isLoggedIn, fetchPolicy: "network-only" },
  );

  // the one and only save
  const [placeOrder, { loading: placing }] =
    useMutation<any>(PLACE_SELLING_ORDER);

  const order: CheckoutOrder | undefined = orderData?.getSellingOrder;
  const addresses: Address[] = addrData?.getMyAddresses ?? [];

  // ---------- step handlers ----------
  const handleAddressConfirmed = (a: Address, info: AreaInfo) => {
    // a different address may have a different service area → pick the slot again
    if (address?.id !== a.id) setSchedule(null);
    setAddress(a);
    setArea(info);
    setOpenStep(2);
  };

  const handleConfirmedAddressChanged = () => {
    setAddress(null);
    setArea(null);
    setSchedule(null);
    setOpenStep(1);
  };

  const handleScheduleConfirmed = (s: ScheduleDraft) => {
    setSchedule(s);
    setOpenStep(3);
  };

  const handlePaymentConfirmed = (p: PaymentDraft) => {
    setPayment(p);
    setOpenStep(0);
  };

  const toggle = (n: number) => setOpenStep((cur) => (cur === n ? 0 : n));

  const canPlace =
    !!address && !!schedule && !!payment && agreed && !placing && !redirecting;

  const handlePlaceOrder = async () => {
    if (!address || !schedule || !payment) return;
    setPlaceError(null);
    try {
      const res = await placeOrder({
        variables: {
          orderNo,
          input: {
            addressId: address.id,
            schedule,
            payment,
            agreedToTerms: agreed,
          },
        },
      });

      // backend returns the saved order → go to its confirmation page
      const savedOrderNo = res.data?.placeSellingOrder?.orderNo ?? orderNo;
      setRedirecting(true); // keep the button disabled until the page changes
      router.replace(`/sell/orderDetails/${savedOrderNo}`);
    } catch (e: any) {
      setPlaceError(e?.message ?? "Could not place your order");
    }
  };

  const wrap = (children: React.ReactNode) => (
    <div className="min-h-dvh bg-[#F8FAFF]">
      <div className="mx-auto w-full max-w-5xl px-4 py-8">{children}</div>
      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        onSuccess={() => {
          setAuthOpen(false);
          refetchAuth();
        }}
      />
    </div>
  );

  if (authLoading) return wrap(<Skeleton />);

  if (!isLoggedIn) {
    return wrap(
      <div className="mx-auto flex max-w-xl flex-col items-center rounded-2xl border border-blue-100 bg-white p-8 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#EEF3FF] text-[#0066FF]">
          <Lock size={22} />
        </span>
        <h2 className="mt-4 text-lg font-bold text-gray-900">
          Log in to continue
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Please log in with the mobile number you used for this order.
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

  if (orderLoading && !order) return wrap(<Skeleton />);

  if (orderError || !order) {
    return wrap(
      <div className="mx-auto max-w-xl rounded-2xl border border-red-100 bg-red-50 p-6 text-center">
        <p className="text-sm font-semibold text-red-600">
          We couldn&apos;t find this order on your account.
        </p>
      </div>,
    );
  }

  // already placed earlier → show its confirmation page instead
  if (order.orderStatus !== "AWAITING_ADDRESS" && !redirecting) {
    return wrap(
      <div className="mx-auto max-w-xl rounded-2xl border border-blue-100 bg-white p-8 text-center">
        <p className="text-sm font-semibold text-gray-900">
          This order is already confirmed.
        </p>
        <Link
          href={`/sell/orderDetails/${order.orderNo}`}
          className="mt-4 inline-block text-sm font-bold text-[#0066FF]"
        >
          View order details
        </Link>
      </div>,
    );
  }

  if (order.totalAmount <= 0) {
    return wrap(
      <div className="mx-auto max-w-xl rounded-2xl border border-blue-100 bg-white p-8 text-center">
        <p className="text-sm font-semibold text-gray-900">
          This device is not eligible for selling.
        </p>
        <Link
          href="/"
          className="mt-4 inline-block text-sm font-bold text-[#0066FF]"
        >
          Go to home
        </Link>
      </div>,
    );
  }

  const scheduleSummary = schedule
    ? `${schedule.method === "DROP_TO_OFFICE" ? "Store drop-off" : "Doorstep pickup"} • ${formatDate(schedule.date)} • ${schedule.slot}`
    : undefined;

  return wrap(
    <>
      <DeviceBar order={order} />

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="order-1 lg:order-2">
          <EstimatedValueCard
            price={order.totalAmount}
            answers={order.answers ?? []}
            productName={order.productName}
            productImage={order.productImage}
          />
        </div>

        {/* pb-28 on mobile so the fixed Continue bar never covers content */}
        <div className="order-2 flex min-w-0 flex-col gap-3 pb-28 lg:order-1 lg:pb-0">
          {/* 1. Address */}
          <StepCard
            index={1}
            title="Address"
            icon={<MapPin size={14} />}
            state={address ? "done" : "active"}
            open={openStep === 1}
            onToggle={() => toggle(1)}
            summary={
              address
                ? `${address.name}, ${address.cityDistrict} - ${address.pinCode}`
                : undefined
            }
          >
            <AddressStep
              addresses={addresses}
              confirmedId={address?.id}
              refetchAddresses={refetchAddresses}
              onConfirmed={handleAddressConfirmed}
              onConfirmedAddressChanged={handleConfirmedAddressChanged}
            />
          </StepCard>

          {/* 2. Schedule Pickup */}
          <StepCard
            index={2}
            title="Schedule Pickup"
            icon={<CalendarDays size={14} />}
            state={schedule ? "done" : address ? "active" : "locked"}
            open={openStep === 2}
            onToggle={() => toggle(2)}
            summary={scheduleSummary}
          >
            {area && (
              <SchedulePickupStep
                area={area}
                initial={schedule}
                onConfirm={handleScheduleConfirmed}
              />
            )}
          </StepCard>

          {/* 3. Payment */}
          <StepCard
            index={3}
            title="Payment Method"
            icon={<Banknote size={14} />}
            state={payment ? "done" : schedule ? "active" : "locked"}
            open={openStep === 3}
            onToggle={() => toggle(3)}
            summary={payment ? PAYMENT_LABEL[payment.method] : undefined}
          >
            <PaymentStep
              isDropToOffice={schedule?.method === "DROP_TO_OFFICE"}
              initial={payment}
              onConfirm={handlePaymentConfirmed}
            />
          </StepCard>

          <label className="mt-1 flex items-start gap-2 text-xs text-gray-700">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5 h-4 w-4 accent-[#0066FF]"
            />
            <span>
              I agree to the{" "}
              <Link
                href="/terms-and-conditions"
                className="font-semibold text-[#0066FF]"
              >
                Terms and Conditions
              </Link>{" "}
              of HelloFi
            </span>
          </label>

          {placeError && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-600">
              {placeError}
            </p>
          )}

          {/* fixed to the bottom on mobile/tablet, normal flow on lg+ */}
          <div className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 shadow-[0_-4px_16px_rgba(0,0,0,0.08)] lg:static lg:z-auto lg:mt-1 lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none">
            <button
              type="button"
              disabled={!canPlace}
              onClick={handlePlaceOrder}
              className="w-full rounded-lg bg-[#0066FF] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-500/30 transition hover:bg-[#0057D9] disabled:cursor-not-allowed disabled:opacity-50 lg:w-fit"
            >
              {placing || redirecting ? "Placing order..." : "Continue"}
            </button>
          </div>
        </div>
      </div>
    </>,
  );
}
