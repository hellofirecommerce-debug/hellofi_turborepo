"use client";

import { useState } from "react";
import { ArrowRight, Landmark, Smartphone } from "lucide-react";
import type { PaymentDraft, PaymentMethod } from "../types";

interface Props {
  isDropToOffice: boolean;
  initial: PaymentDraft | null; // what the user entered earlier (page state)
  onConfirm: (payment: PaymentDraft) => void;
}

const UPI = /^[\w.\-]{2,256}@[a-zA-Z]{2,64}$/;
const IFSC = /^[A-Z]{4}0[A-Z0-9]{6}$/;

// text-base on mobile stops iPhones from zooming into the field
const inputCls = (err?: string) =>
  `w-full min-w-0 rounded-lg border bg-white px-3 py-3 text-base text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#0066FF] sm:py-2.5 sm:text-sm ${
    err ? "border-red-400" : "border-gray-300"
  }`;

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block min-w-0">
      <span className="mb-1 block text-xs font-semibold text-gray-700">
        {label}
      </span>
      {children}
      {error && (
        <span className="mt-1 block text-[11px] text-red-500">{error}</span>
      )}
    </label>
  );
}

export default function PaymentStep({
  isDropToOffice,
  initial,
  onConfirm,
}: Props) {
  const [method, setMethod] = useState<PaymentMethod>(initial?.method ?? "UPI");
  const [upiId, setUpiId] = useState(
    initial?.method === "UPI" ? initial.upiId : "",
  );
  const [bankName, setBankName] = useState(
    initial?.method === "BANK" ? initial.bankName : "",
  );
  const [holder, setHolder] = useState(
    initial?.method === "BANK" ? initial.accountHolderName : "",
  );
  const [account, setAccount] = useState(
    initial?.method === "BANK" ? initial.bankAccountNumber : "",
  );
  const [ifsc, setIfsc] = useState(
    initial?.method === "BANK" ? initial.ifscCode : "",
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const options = [
    {
      id: "UPI" as PaymentMethod,
      title: "UPI Transfer",
      desc: "Instant transfer to Google Pay, PhonePe, Paytm & more",
      icon: Smartphone,
    },
    {
      id: "BANK" as PaymentMethod,
      title: "Bank Transfer",
      desc: "Direct transfer to your bank account",
      icon: Landmark,
    },
  ];

  const clear = (key: string) => setErrors((p) => ({ ...p, [key]: "" }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (method === "UPI" && !UPI.test(upiId.trim()))
      e.upiId = "Enter a valid UPI ID";
    if (method === "BANK") {
      if (bankName.trim().length < 2) e.bankName = "Enter bank name";
      if (holder.trim().length < 2) e.holder = "Enter account holder name";
      if (!/^\d{9,18}$/.test(account.trim()))
        e.account = "Enter a valid account number";
      if (!IFSC.test(ifsc.trim().toUpperCase()))
        e.ifsc = "Enter a valid IFSC code";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleConfirm = () => {
    if (!validate()) return;

    if (method === "UPI") {
      onConfirm({ method, upiId: upiId.trim() });
    } else if (method === "BANK") {
      onConfirm({
        method,
        bankName: bankName.trim(),
        accountHolderName: holder.trim(),
        bankAccountNumber: account.trim(),
        ifscCode: ifsc.trim().toUpperCase(),
      });
    } else {
      onConfirm({ method: "CASH" });
    }
  };

  return (
    <div className="min-w-0">
      <p className="mb-3 text-xs text-gray-500">
        Choose your preferred payment method
      </p>

      <div role="radiogroup" className="flex flex-col gap-3">
        {options.map(({ id, title, desc, icon: Icon }) => {
          const selected = method === id;
          return (
            <div
              key={id}
              className={`overflow-hidden rounded-lg border transition ${
                selected
                  ? "border-[#0066FF] bg-[#F7FAFF]"
                  : "border-gray-200 bg-white"
              }`}
            >
              <button
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => {
                  setMethod(id);
                  setErrors({});
                }}
                className="flex w-full items-center gap-3 px-3 py-3.5 text-left sm:px-4"
              >
                <span
                  className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${
                    selected ? "border-[#0066FF]" : "border-gray-300"
                  }`}
                >
                  {selected && (
                    <span className="h-2 w-2 rounded-full bg-[#0066FF]" />
                  )}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-bold text-gray-900">
                    {title}
                  </span>
                  <span className="mt-0.5 block text-[11px] leading-snug text-gray-500">
                    {desc}
                  </span>
                </span>
                <Icon
                  size={18}
                  className={`shrink-0 ${selected ? "text-[#0066FF]" : "text-gray-400"}`}
                />
              </button>

              {selected && id === "UPI" && (
                <div className="px-3 pb-4 sm:px-4">
                  <Field label="UPI ID *" error={errors.upiId}>
                    <input
                      className={inputCls(errors.upiId)}
                      value={upiId}
                      autoCapitalize="none"
                      autoCorrect="off"
                      onChange={(e) => {
                        setUpiId(e.target.value);
                        clear("upiId");
                      }}
                      placeholder="yourname@upi"
                    />
                  </Field>
                </div>
              )}

              {selected && id === "BANK" && (
                <div className="grid grid-cols-1 gap-3 px-3 pb-4 sm:grid-cols-2 sm:px-4">
                  <Field label="Bank Name *" error={errors.bankName}>
                    <input
                      className={inputCls(errors.bankName)}
                      value={bankName}
                      onChange={(e) => {
                        setBankName(e.target.value);
                        clear("bankName");
                      }}
                    />
                  </Field>
                  <Field label="Account Holder Name *" error={errors.holder}>
                    <input
                      className={inputCls(errors.holder)}
                      value={holder}
                      onChange={(e) => {
                        setHolder(e.target.value);
                        clear("holder");
                      }}
                    />
                  </Field>
                  <Field label="Account Number *" error={errors.account}>
                    <input
                      className={inputCls(errors.account)}
                      inputMode="numeric"
                      maxLength={18}
                      value={account}
                      onChange={(e) => {
                        setAccount(e.target.value.replace(/\D/g, ""));
                        clear("account");
                      }}
                    />
                  </Field>
                  <Field label="IFSC Code *" error={errors.ifsc}>
                    <input
                      className={inputCls(errors.ifsc)}
                      maxLength={11}
                      autoCapitalize="characters"
                      value={ifsc}
                      onChange={(e) => {
                        setIfsc(e.target.value.toUpperCase());
                        clear("ifsc");
                      }}
                    />
                  </Field>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <p className="mt-3 rounded-lg bg-[#F4F7FF] px-3 py-2 text-[11px] leading-snug text-gray-600">
        UPI and Bank Transfer are processed instantly after device verification.
        Cash is paid on the spot.
      </p>

      <button
        type="button"
        onClick={handleConfirm}
        className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-lg bg-[#0066FF] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-500/30 transition hover:bg-[#0057D9]"
      >
        Confirm Payment Method
        <ArrowRight size={14} />
      </button>
    </div>
  );
}
