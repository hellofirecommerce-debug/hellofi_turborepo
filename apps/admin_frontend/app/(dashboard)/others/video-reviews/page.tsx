"use client";
import React, { useEffect, useState } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { Plus } from "lucide-react";
import { Button, ConfirmDialog } from "@repo/ui";
import { toast } from "sonner";
import { PageHeader } from "../../../../components/ui/PageHeader";
import { VideoReviewsTable } from "./VideoReviewsTable";
import { VideoReviewsSkeleton } from "./VideoReviewsSkeleton";
import { AddVideoReviewModal } from "./AddVideoReviewModal";
import { VideoReview } from "./types";
import {
  GET_VIDEO_REVIEWS,
  CREATE_VIDEO_REVIEW,
  UPDATE_VIDEO_REVIEW,
  DELETE_VIDEO_REVIEW,
} from "../../../../lib/graphql/queries/videoReview.queries";

export default function VideoReviewsPage() {
  const [showModal, setShowModal] = useState(false);
  const [reviews, setReviews] = useState<VideoReview[]>([]);
  const [editReview, setEditReview] = useState<VideoReview | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { loading, data } = useQuery<{ getVideoReviews: VideoReview[] }>(
    GET_VIDEO_REVIEWS,
    { fetchPolicy: "cache-and-network" },
  );

  useEffect(() => {
    if (data?.getVideoReviews) setReviews(data.getVideoReviews);
  }, [data]);

  const [createReview, { loading: creating }] = useMutation<{
    createVideoReview: VideoReview;
  }>(CREATE_VIDEO_REVIEW, {
    onCompleted(data) {
      setReviews((prev) => [data.createVideoReview, ...prev]);
      toast.success("Video review created successfully");
      setShowModal(false);
    },
    onError(error) {
      toast.error(error.message);
    },
  });

  const [updateReview, { loading: updating }] = useMutation<{
    updateVideoReview: VideoReview;
  }>(UPDATE_VIDEO_REVIEW, {
    onCompleted(data) {
      setReviews((prev) =>
        prev.map((r) =>
          r.id === data.updateVideoReview.id ? data.updateVideoReview : r,
        ),
      );
      toast.success("Video review updated successfully");
      setShowModal(false);
      setEditReview(null);
    },
    onError(error) {
      toast.error(error.message);
    },
  });

  const [deleteReview, { loading: deleting }] = useMutation<{
    deleteVideoReview: { id: string };
  }>(DELETE_VIDEO_REVIEW, {
    onCompleted() {
      setReviews((prev) => prev.filter((r) => r.id !== deleteId));
      toast.success("Video review deleted successfully");
      setDeleteId(null);
    },
    onError(error) {
      toast.error(error.message);
    },
  });

  const handleAdd = async (formData: any) => {
    await createReview({
      variables: {
        input: {
          title: formData.title || undefined,
          type: formData.type,
          priority: Number(formData.priority ?? 0),
        },
        video: formData.video,
        thumbnail: formData.thumbnail,
      },
    });
  };

  const handleUpdate = async (formData: any) => {
    await updateReview({
      variables: {
        id: editReview?.id,
        input: {
          title: formData.title || undefined,
          type: formData.type,
          priority: Number(formData.priority ?? 0),
          isActive: formData.isActive,
        },
        ...(formData.video && { video: formData.video }),
        ...(formData.thumbnail && { thumbnail: formData.thumbnail }),
      },
    });
  };

  return (
    <div>
      <PageHeader
        title="Video Reviews"
        breadcrumbs={[{ label: "Others" }, { label: "Video Reviews" }]}
      />

      {loading ? (
        <VideoReviewsSkeleton />
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 border-b border-gray-100">
            <div>
              <h2 className="text-base font-semibold text-gray-900">
                All Video Reviews
              </h2>
              <p className="text-sm text-gray-500 mt-0.5">
                {reviews.length} total reviews
              </p>
            </div>
            <Button
              size="md"
              className="gap-2 w-full sm:w-auto"
              onClick={() => setShowModal(true)}
            >
              <Plus size={15} />
              Add Video Review
            </Button>
          </div>

          <VideoReviewsTable
            data={reviews}
            onEdit={(review) => {
              setEditReview(review);
              setShowModal(true);
            }}
            onDelete={(id) => setDeleteId(id)}
          />
        </div>
      )}

      <AddVideoReviewModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditReview(null);
        }}
        onSubmit={editReview ? handleUpdate : handleAdd}
        isLoading={creating || updating}
        editData={editReview}
      />

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={async () => {
          if (!deleteId) return;
          await deleteReview({ variables: { id: deleteId } });
        }}
        title="Delete Video Review"
        description="Are you sure you want to delete this video review? The video and thumbnail will be permanently removed from S3."
        confirmLabel="Delete"
        isLoading={deleting}
      />
    </div>
  );
}
