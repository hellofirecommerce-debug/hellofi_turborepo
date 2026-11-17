"use client";

import { useEffect, useState } from "react";
import { useApolloClient, useMutation } from "@apollo/client/react";
import { ArrowRight, Plus } from "lucide-react";
import { DELETE_ADDRESS } from "../../../../lib/graphql/mutations/checkout.mutations";
import { CHECK_PINCODE } from "../../../../lib/graphql/queires/checkout.queries";
import type { Address, AreaInfo } from "../types";
import { AddressCard } from "./AddressCard";
import { AddressModal } from "./AddressModal";

interface Props {
  addresses: Address[];
  confirmedId?: string | null; // address already confirmed in the page state
  refetchAddresses: () => Promise<unknown>;
  onConfirmed: (address: Address, area: AreaInfo) => void;
  onConfirmedAddressChanged: () => void; // confirmed address was edited / deleted
}

export default function AddressStep({
  addresses,
  confirmedId,
  refetchAddresses,
  onConfirmed,
  onConfirmedAddressChanged,
}: Props) {
  const client = useApolloClient();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Address | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [deleteAddress, { loading: deleting }] =
    useMutation<any>(DELETE_ADDRESS);

  // keep a valid selection: confirmed one → default → first
  useEffect(() => {
    if (selectedId && addresses.some((a) => a.id === selectedId)) return;
    const preferred =
      addresses.find((a) => a.id === confirmedId) ??
      addresses.find((a) => a.isDefault) ??
      addresses[0];
    setSelectedId(preferred?.id ?? null);
  }, [addresses, confirmedId, selectedId]);

  const openAdd = () => {
    setEditing(null);
    setModalOpen(true);
  };
  const openEdit = (a: Address) => {
    setEditing(a);
    setModalOpen(true);
  };

  const handleSaved = async (saved: Address) => {
    setModalOpen(false);
    setEditing(null);
    await refetchAddresses();
    setSelectedId(saved.id);
    // pincode may have changed → the old service check is no longer valid
    if (saved.id === confirmedId) onConfirmedAddressChanged();
  };

  const handleDelete = async (id: string) => {
    setError(null);
    try {
      await deleteAddress({ variables: { id } });
      setDeletingId(null);
      if (selectedId === id) setSelectedId(null);
      if (id === confirmedId) onConfirmedAddressChanged();
      await refetchAddresses();
    } catch (e: any) {
      setError(e?.message ?? "Could not delete address");
    }
  };

  // Backend call #1: is this pincode serviceable / drop-off available?
  const handleConfirm = async () => {
    const address = addresses.find((a) => a.id === selectedId);
    if (!address) return;

    setError(null);
    setChecking(true);
    try {
      const { data } = await client.query<any>({
        query: CHECK_PINCODE,
        variables: { pinCode: address.pinCode },
        fetchPolicy: "network-only",
      });
      const info = data?.checkPincode;

      if (!info?.serviceable && !info?.isDropToOfficeAvailable) {
        setError(
          "We don't service this pincode yet. Please choose a different address.",
        );
        return;
      }

      onConfirmed(address, {
        serviceable: !!info.serviceable,
        isDropToOfficeAvailable: !!info.isDropToOfficeAvailable,
        city: info.city ?? null,
      });
    } catch (e: any) {
      setError(e?.message ?? "Could not check service availability");
    } finally {
      setChecking(false);
    }
  };

  return (
    <div>
      <div role="radiogroup" className="flex flex-col gap-3">
        {addresses.map((a) => (
          <AddressCard
            key={a.id}
            address={a}
            selected={a.id === selectedId}
            confirmingDelete={deletingId === a.id}
            deleting={deleting}
            onSelect={() => setSelectedId(a.id)}
            onEdit={() => openEdit(a)}
            onAskDelete={() => setDeletingId(a.id)}
            onCancelDelete={() => setDeletingId(null)}
            onConfirmDelete={() => handleDelete(a.id)}
          />
        ))}

        <button
          type="button"
          onClick={openAdd}
          className="flex items-center justify-center gap-1.5 rounded-lg border border-dashed border-[#0066FF] bg-white py-3 text-xs font-bold text-[#0066FF] hover:bg-[#F7FAFF]"
        >
          <Plus size={14} />
          Add New Address
        </button>
      </div>

      {error && (
        <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-600">
          {error}
        </p>
      )}

      <div className="mt-4 flex justify-end">
        <button
          type="button"
          disabled={!selectedId || checking}
          onClick={handleConfirm}
          className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-[#0066FF] px-6 py-3 text-xs font-bold text-white shadow-lg shadow-blue-500/30 transition hover:bg-[#0057D9] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
        >
          {checking ? "Checking..." : "Confirm Address"}
          <ArrowRight size={14} />
        </button>
      </div>

      <AddressModal
        isOpen={modalOpen}
        address={editing}
        onClose={() => {
          setModalOpen(false);
          setEditing(null);
        }}
        onSaved={handleSaved}
      />
    </div>
  );
}
