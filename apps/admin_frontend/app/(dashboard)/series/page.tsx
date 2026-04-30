"use client";
import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { Plus } from "lucide-react";
import { Button, ConfirmDialog } from "@repo/ui";
import { toast } from "sonner";
import { PageHeader } from "../../../components/ui/PageHeader";
import { SeriesTable } from "./SeriesTable";
import { SeriesSkeleton } from "./SeriesSkeleton";
import { AddSeriesModal } from "./AddSeriesModal";
import { SeriesFilterBar } from "./SeriesFilterBar";
import { Series, SeriesResponse } from "./types";
import { GET_SERIES } from "../../../lib/graphql/queries/series.queries";
import { GET_CATEGORIES } from "../../../lib/graphql/queries/category.queries";
import { GET_BRANDS } from "../../../lib/graphql/queries/brand.queries";
import {
  CREATE_SERIES,
  UPDATE_SERIES,
  DELETE_SERIES,
} from "../../../lib/graphql/mutations/series.mutations";

interface SeriesFilter {
  search?: string;
  brandId?: string;
  categoryId?: string;
  page?: number;
  pageSize?: number;
}

export default function SeriesPage() {
  const [filter, setFilter] = useState<SeriesFilter>({ page: 1, pageSize: 10 });
  const [showModal, setShowModal] = useState(false);
  const [editSeries, setEditSeries] = useState<Series | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [seriesList, setSeriesList] = useState<Series[]>([]);
  const [paginationMeta, setPaginationMeta] = useState({
    total: 0,
    page: 1,
    pageSize: 10,
    totalPages: 1,
  });

  const { data, loading } = useQuery<{ getSeries: SeriesResponse }>(
    GET_SERIES,
    {
      variables: { filter },
      fetchPolicy: "cache-and-network",
    },
  );

  const { data: categoriesData } = useQuery<{
    getCategories: { id: string; name: string }[];
  }>(GET_CATEGORIES, { fetchPolicy: "cache-and-network" });

  const { data: brandsData } = useQuery<{
    getBrands: { id: string; name: string }[];
  }>(GET_BRANDS, { fetchPolicy: "cache-and-network" });

  const categories = categoriesData?.getCategories ?? [];
  const brands = brandsData?.getBrands ?? [];

  // ── Sync query data into local state ──
  useEffect(() => {
    if (data?.getSeries) {
      setSeriesList(data.getSeries.items);
      setPaginationMeta({
        total: data.getSeries.total,
        page: data.getSeries.page,
        pageSize: data.getSeries.pageSize,
        totalPages: data.getSeries.totalPages,
      });
    }
  }, [data]);

  const [createSeries, { loading: creating }] = useMutation<{
    createSeries: Series;
  }>(CREATE_SERIES, {
    onCompleted(res) {
      toast.success("Series created successfully");
      setShowModal(false);
      setSeriesList((prev) => [res.createSeries, ...prev]);
      setPaginationMeta((prev) => ({ ...prev, total: prev.total + 1 }));
    },
  });

  const [updateSeries, { loading: updating }] = useMutation<{
    updateSeries: Series;
  }>(UPDATE_SERIES, {
    onCompleted(res) {
      toast.success("Series updated successfully");
      setShowModal(false);
      setEditSeries(null);
      setSeriesList((prev) =>
        prev.map((s) => (s.id === res.updateSeries.id ? res.updateSeries : s)),
      );
    },
  });

  const [deleteSeries, { loading: deleting }] = useMutation<{
    deleteSeries: { id: string; message: string };
  }>(DELETE_SERIES, {
    onCompleted(res) {
      toast.success("Series deleted successfully");
      setSeriesList((prev) => prev.filter((s) => s.id !== res.deleteSeries.id));
      setPaginationMeta((prev) => ({ ...prev, total: prev.total - 1 }));
      setDeleteId(null);
    },
  });

  const handleFilterChange = (key: keyof SeriesFilter, value: any) => {
    setFilter((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const handleReset = () => {
    setFilter({ page: 1, pageSize: filter.pageSize ?? 10 });
  };

  const handleSubmit = async (formData: any) => {
    if (editSeries) {
      await updateSeries({ variables: { id: editSeries.id, input: formData } });
    } else {
      await createSeries({ variables: { input: formData } });
    }
  };

  const handleEdit = (series: Series) => {
    setEditSeries(series);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditSeries(null);
  };

  const handlePageChange = (newPage: number) => {
    setFilter((prev) => ({ ...prev, page: newPage }));
  };

  const handlePageSizeChange = (newSize: number) => {
    setFilter((prev) => ({ ...prev, pageSize: newSize, page: 1 }));
  };

  return (
    <div>
      <PageHeader
        title="Series"
        breadcrumbs={[{ label: "Catalogue" }, { label: "Series" }]}
      />

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 border-b border-gray-100">
          <div>
            <h2 className="text-base font-semibold text-gray-900">
              Series List
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {paginationMeta.total} total series
            </p>
          </div>
          <Button
            size="md"
            className="gap-2 w-full sm:w-auto"
            onClick={() => setShowModal(true)}
          >
            <Plus size={15} />
            Add Series
          </Button>
        </div>

        <div className="p-4 border-b border-gray-100">
          <SeriesFilterBar
            filter={filter}
            onChange={handleFilterChange}
            onReset={handleReset}
          />
        </div>

        {loading && seriesList.length === 0 ? (
          <SeriesSkeleton />
        ) : (
          <SeriesTable
            data={seriesList}
            total={paginationMeta.total}
            currentPage={filter.page ?? 1}
            pageSize={filter.pageSize ?? 10}
            totalPages={paginationMeta.totalPages}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            onEdit={handleEdit}
            onDelete={(id) => setDeleteId(id)}
            loading={loading} // ← add
          />
        )}
      </div>

      <AddSeriesModal
        isOpen={showModal}
        onClose={handleModalClose}
        onSubmit={handleSubmit}
        isLoading={creating || updating}
        editData={editSeries}
        brands={brands}
        categories={categories}
      />

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={async () => {
          if (!deleteId) return;
          await deleteSeries({ variables: { id: deleteId } });
        }}
        title="Delete Series"
        description="Are you sure you want to delete this series? This action cannot be undone."
        confirmLabel="Delete"
        isLoading={deleting}
      />
    </div>
  );
}
