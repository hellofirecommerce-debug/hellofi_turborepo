"use client";
import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { Button, ConfirmDialog } from "@repo/ui";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { BuyCategoryBannerTable } from "./BuyCategoryBannerTable";
import { BannersSkeleton } from "./BannersSkeleton";
import { AddBannerModal, AddBannerForm } from "./AddBannerModal";
import { BuyCategoryBanner } from "./types";
import { GET_BANNERS } from "../../../lib/graphql/queries/banner.queries";
import {
  CREATE_BANNER,
  UPDATE_BANNER,
  DELETE_BANNER,
} from "../../../lib/graphql/mutations/banner.mutations";

export default function BuyingCategoryBannerPage() {
  const [showModal, setShowModal] = useState(false);
  const [editBanner, setEditBanner] = useState<BuyCategoryBanner | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<BuyCategoryBanner | null>(
    null,
  );

  const { data, loading } = useQuery<{ banners: BuyCategoryBanner[] }>(
    GET_BANNERS,
  );

  const [createBanner, { loading: creating }] = useMutation(CREATE_BANNER, {
    refetchQueries: [{ query: GET_BANNERS }],
    onCompleted() {
      toast.success("Banner created successfully");
      handleModalClose();
    },
  });

  const [updateBanner, { loading: updating }] = useMutation(UPDATE_BANNER, {
    refetchQueries: [{ query: GET_BANNERS }],
    onCompleted() {
      toast.success("Banner updated successfully");
      handleModalClose();
    },
  });

  const [deleteBanner, { loading: deleting }] = useMutation(DELETE_BANNER, {
    refetchQueries: [{ query: GET_BANNERS }],
    onCompleted() {
      toast.success("Banner deleted");
      setDeleteTarget(null);
    },
  });

  const handleModalClose = () => {
    setShowModal(false);
    setEditBanner(null);
  };

  const handleCreate = (form: AddBannerForm) => {
    createBanner({
      variables: {
        alt: form.alt,
        redirectUrl: form.redirectUrl || null,
        placement: form.placement,
        priority: form.priority,
        lgFile: form.lgFile,
        smFile: form.smFile,
      },
    });
  };

  const handleUpdate = (form: AddBannerForm) => {
    if (!editBanner) return;
    updateBanner({
      variables: {
        id: editBanner.id,
        alt: form.alt,
        redirectUrl: form.redirectUrl || null,
        placement: form.placement,
        priority: form.priority,
        lgFile: form.lgFile, // null if not changed
        smFile: form.smFile,
      },
    });
  };

  const handleEdit = (banner: BuyCategoryBanner) => {
    setEditBanner(banner);
    setShowModal(true);
  };

  if (loading) return <BannersSkeleton />;

  const banners = data?.banners ?? [];

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Top bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 border-b border-gray-100">
        <div>
          <h2 className="text-lg font-semibold text-[#1a1a2e]">
            Buying Category Banners
          </h2>
          <p className="text-sm text-gray-500">
            Manage the banners shown on buy category pages
          </p>
        </div>
        <Button
          size="sm"
          onClick={() => {
            setEditBanner(null);
            setShowModal(true);
          }}
        >
          <Plus size={16} className="mr-1" />
          Add Banner
        </Button>
      </div>

      {/* Table */}
      <BuyCategoryBannerTable
        banners={banners}
        onEdit={handleEdit}
        onDelete={(id) => {
          const banner = banners.find((b) => b.id === id) || null;
          setDeleteTarget(banner);
        }}
      />

      {/* Add / Edit modal (same modal) */}
      <AddBannerModal
        isOpen={showModal}
        onClose={handleModalClose}
        onSubmit={editBanner ? handleUpdate : handleCreate}
        isLoading={creating || updating}
        editData={editBanner}
      />

      {/* Delete confirm dialog */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget)
            deleteBanner({ variables: { id: deleteTarget.id } });
        }}
        title="Delete Banner"
        description={`Are you sure you want to delete "${deleteTarget?.alt}"? This action cannot be undone.`}
        confirmLabel={`Delete`}
        // confirmText={deleting ? "Deleting..." : "Delete"}
        isLoading={deleting}
        variant="danger"
      />
    </div>
  );
}
