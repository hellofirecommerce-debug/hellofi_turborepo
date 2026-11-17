"use client";

import { useEffect, useState } from "react";
import { useApolloClient, useMutation } from "@apollo/client/react";
import { AlertCircle, CheckCircle2, X } from "lucide-react";
import {
  CREATE_ADDRESS,
  UPDATE_ADDRESS,
} from "../../../../lib/graphql/mutations/checkout.mutations";
import { CHECK_PINCODE } from "../../../../lib/graphql/queires/checkout.queries";
import type { Address, AddressType } from "../types";

interface Props {
  isOpen: boolean;
  address?: Address | null; // present = edit mode
  onClose: () => void;
  onSaved: (address: Address) => void;
}

interface FormState {
  name: string;
  contact: string;
  alternateContactNo: string;
  email: string;
  address: string;
  pinCode: string;
  landMark: string;
  cityDistrict: string;
  state: string;
  gst: string;
  addressType: AddressType;
  isDefault: boolean;
}

type Errors = Partial<Record<keyof FormState, string>>;

const EMPTY: FormState = {
  name: "",
  contact: "",
  alternateContactNo: "",
  email: "",
  address: "",
  pinCode: "",
  landMark: "",
  cityDistrict: "",
  state: "",
  gst: "",
  addressType: "HOME",
  isDefault: false,
};

const fromAddress = (a: Address): FormState => ({
  name: a.name,
  contact: a.contact,
  alternateContactNo: a.alternateContactNo ?? "",
  email: a.email,
  address: a.address,
  pinCode: a.pinCode,
  landMark: a.landMark ?? "",
  cityDistrict: a.cityDistrict,
  state: a.state,
  gst: a.gst ?? "",
  addressType: a.addressType,
  isDefault: a.isDefault,
});

const MOBILE = /^[6-9]\d{9}$/;
const GST = /^\d{2}[A-Z]{5}\d{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;

function validate(f: FormState): Errors {
  const e: Errors = {};
  if (f.name.trim().length < 2) e.name = "Enter your full name";
  if (!MOBILE.test(f.contact.trim()))
    e.contact = "Enter a valid 10-digit mobile number";
  if (f.alternateContactNo.trim() && !MOBILE.test(f.alternateContactNo.trim()))
    e.alternateContactNo = "Enter a valid alternate number";
  if (!/^\S+@\S+\.\S+$/.test(f.email.trim())) e.email = "Enter a valid email";
  if (f.address.trim().length < 5) e.address = "Enter your full address";
  if (!/^\d{6}$/.test(f.pinCode.trim()))
    e.pinCode = "Enter a valid 6-digit pincode";
  if (f.cityDistrict.trim().length < 2)
    e.cityDistrict = "Enter city / district";
  if (f.state.trim().length < 2) e.state = "Enter state";
  if (f.gst.trim() && !GST.test(f.gst.trim().toUpperCase()))
    e.gst = "Enter a valid GSTIN";
  return e;
}

const inputCls = (hasError?: string) =>
  `w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#0066FF] ${
    hasError ? "border-red-400" : "border-gray-300"
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
    <label className="block">
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

export function AddressModal({ isOpen, address, onClose, onSaved }: Props) {
  const client = useApolloClient();
  const isEdit = !!address;

  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [pinInfo, setPinInfo] = useState<{
    serviceable: boolean;
    city?: string | null;
  } | null>(null);

  const [createAddress, { loading: creating }] =
    useMutation<any>(CREATE_ADDRESS);
  const [updateAddress, { loading: updating }] =
    useMutation<any>(UPDATE_ADDRESS);
  const saving = creating || updating;

  // reset whenever the modal opens
  useEffect(() => {
    if (!isOpen) return;
    setForm(address ? fromAddress(address) : EMPTY);
    setErrors({});
    setServerError(null);
    setPinInfo(null);
  }, [isOpen, address]);

  // lock scroll + Esc to close
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [isOpen, onClose]);

  // serviceability hint when 6 digits are typed
  useEffect(() => {
    if (!/^\d{6}$/.test(form.pinCode)) {
      setPinInfo(null);
      return;
    }
    let cancelled = false;
    const t = setTimeout(async () => {
      try {
        const { data } = await client.query<any>({
          query: CHECK_PINCODE,
          variables: { pinCode: form.pinCode },
          fetchPolicy: "network-only",
        });
        if (cancelled) return;
        const info = data?.checkPincode ?? null;
        setPinInfo(info);
        if (info?.serviceable && info.city) {
          setForm((p) =>
            p.cityDistrict ? p : { ...p, cityDistrict: info.city },
          );
        }
      } catch {
        if (!cancelled) setPinInfo(null);
      }
    }, 400);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [form.pinCode, client]);

  if (!isOpen) return null;

  const set =
    <K extends keyof FormState>(key: K) =>
    (value: FormState[K]) => {
      setForm((p) => ({ ...p, [key]: value }));
      setErrors((p) => ({ ...p, [key]: undefined }));
    };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setServerError(null);
    const input = {
      name: form.name.trim(),
      contact: form.contact.trim(),
      alternateContactNo: form.alternateContactNo.trim() || undefined,
      email: form.email.trim(),
      address: form.address.trim(),
      pinCode: form.pinCode.trim(),
      landMark: form.landMark.trim() || undefined,
      cityDistrict: form.cityDistrict.trim(),
      state: form.state.trim(),
      gst: form.gst.trim().toUpperCase() || undefined,
      addressType: form.addressType,
      isDefault: form.isDefault,
    };

    try {
      const res = isEdit
        ? await updateAddress({ variables: { id: address!.id, input } })
        : await createAddress({ variables: { input } });
      const saved = isEdit ? res.data?.updateAddress : res.data?.createAddress;
      onSaved(saved as Address);
    } catch (err: any) {
      setServerError(err?.message ?? "Something went wrong. Please try again.");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={isEdit ? "Edit address" : "Add new address"}
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[92dvh] w-full max-w-lg flex-col rounded-t-2xl bg-white shadow-2xl sm:rounded-2xl"
      >
        {/* header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <h2 className="text-base font-extrabold text-gray-900">
            {isEdit ? "Edit Address" : "Add New Address"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-full p-1 text-gray-500 hover:bg-gray-100"
          >
            <X size={18} />
          </button>
        </div>

        {/* body */}
        <form onSubmit={submit} className="flex min-h-0 flex-1 flex-col">
          <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
            <Field label="Full Name *" error={errors.name}>
              <input
                className={inputCls(errors.name)}
                value={form.name}
                onChange={(e) => set("name")(e.target.value)}
                placeholder="Name on the address"
              />
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Mobile Number *" error={errors.contact}>
                <input
                  className={inputCls(errors.contact)}
                  inputMode="numeric"
                  maxLength={10}
                  value={form.contact}
                  onChange={(e) =>
                    set("contact")(e.target.value.replace(/\D/g, ""))
                  }
                  placeholder="10-digit number"
                />
              </Field>
              <Field label="Alternate Number" error={errors.alternateContactNo}>
                <input
                  className={inputCls(errors.alternateContactNo)}
                  inputMode="numeric"
                  maxLength={10}
                  value={form.alternateContactNo}
                  onChange={(e) =>
                    set("alternateContactNo")(e.target.value.replace(/\D/g, ""))
                  }
                  placeholder="Optional"
                />
              </Field>
            </div>

            <Field label="Email *" error={errors.email}>
              <input
                type="email"
                className={inputCls(errors.email)}
                value={form.email}
                onChange={(e) => set("email")(e.target.value)}
                placeholder="you@example.com"
              />
            </Field>

            <Field
              label="Address (House no, Building, Street, Area) *"
              error={errors.address}
            >
              <textarea
                rows={2}
                className={inputCls(errors.address)}
                value={form.address}
                onChange={(e) => set("address")(e.target.value)}
              />
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Pincode *" error={errors.pinCode}>
                <input
                  className={inputCls(errors.pinCode)}
                  inputMode="numeric"
                  maxLength={6}
                  value={form.pinCode}
                  onChange={(e) =>
                    set("pinCode")(e.target.value.replace(/\D/g, ""))
                  }
                  placeholder="6-digit pincode"
                />
                {pinInfo && (
                  <span
                    className={`mt-1 flex items-center gap-1 text-[11px] font-medium ${
                      pinInfo.serviceable
                        ? "text-emerald-600"
                        : "text-amber-600"
                    }`}
                  >
                    {pinInfo.serviceable ? (
                      <>
                        <CheckCircle2 size={12} /> Service available
                        {pinInfo.city ? ` in ${pinInfo.city}` : ""}
                      </>
                    ) : (
                      <>
                        <AlertCircle size={12} /> Doorstep pickup not available
                        here yet
                      </>
                    )}
                  </span>
                )}
              </Field>

              <Field label="City / District *" error={errors.cityDistrict}>
                <input
                  className={inputCls(errors.cityDistrict)}
                  value={form.cityDistrict}
                  onChange={(e) => set("cityDistrict")(e.target.value)}
                />
              </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="State *" error={errors.state}>
                <input
                  className={inputCls(errors.state)}
                  value={form.state}
                  onChange={(e) => set("state")(e.target.value)}
                />
              </Field>
              <Field label="Landmark" error={errors.landMark}>
                <input
                  className={inputCls(errors.landMark)}
                  value={form.landMark}
                  onChange={(e) => set("landMark")(e.target.value)}
                  placeholder="Optional"
                />
              </Field>
            </div>

            <Field label="GST Number" error={errors.gst}>
              <input
                className={inputCls(errors.gst)}
                maxLength={15}
                value={form.gst}
                onChange={(e) => set("gst")(e.target.value.toUpperCase())}
                placeholder="Optional"
              />
            </Field>

            <div>
              <span className="mb-1.5 block text-xs font-semibold text-gray-700">
                Address Type
              </span>
              <div className="flex gap-2">
                {(["HOME", "WORK", "OTHER"] as AddressType[]).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => set("addressType")(t)}
                    className={`flex-1 rounded-lg border px-3 py-2 text-xs font-bold capitalize transition ${
                      form.addressType === t
                        ? "border-[#0066FF] bg-[#EEF3FF] text-[#0066FF]"
                        : "border-gray-300 bg-white text-gray-600"
                    }`}
                  >
                    {t.toLowerCase()}
                  </button>
                ))}
              </div>
            </div>

            <label className="flex items-center gap-2 text-xs text-gray-700">
              <input
                type="checkbox"
                checked={form.isDefault}
                onChange={(e) => set("isDefault")(e.target.checked)}
                className="h-4 w-4 accent-[#0066FF]"
              />
              Make this my default address
            </label>

            {serverError && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-600">
                {serverError}
              </p>
            )}
          </div>

          {/* footer */}
          <div className="flex gap-3 border-t border-gray-100 px-5 py-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-gray-300 px-4 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 rounded-lg bg-[#0066FF] px-4 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/30 hover:bg-[#0057D9] disabled:opacity-60"
            >
              {saving
                ? "Saving..."
                : isEdit
                  ? "Update Address"
                  : "Save Address"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
