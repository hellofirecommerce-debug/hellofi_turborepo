"use client";
import React, { useEffect, useState } from "react";
import { useLazyQuery, useMutation } from "@apollo/client/react";
import { Check } from "lucide-react";
import { Button, Label } from "@repo/ui";
import { toast } from "sonner";
import { ModalShell } from "./ModalShell";
import { AdminSellingOrder, OrderTimelineState } from "../types";
import { GET_ADMIN_ORDER_TIMELINE } from "../../../../../lib/graphql/queries/sellingOrder.queries";
import { ADMIN_UPDATE_ORDER_TIMELINE_STATUS } from "../../../../../lib/graphql/mutations/sellingOrder.mutations";

interface Props {
  order: AdminSellingOrder | null;
  onClose: () => void;
  onUpdated: () => void;
}

const fieldClass =
  "w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-[3px] focus:border-[rgb(33,76,123)] focus:ring-[rgb(33,76,123)]/25";

export const UpdateStatusModal: React.FC<Props> = ({
  order,
  onClose,
  onUpdated,
}) => {
  const [status, setStatus] = useState("");
  const [message, setMessage] = useState("");

  const [fetchTimeline, { data, loading }] = useLazyQuery<{
    adminOrderTimeline: OrderTimelineState;
  }>(GET_ADMIN_ORDER_TIMELINE, { fetchPolicy: "network-only" });

  const [updateStatus, { loading: saving }] = useMutation(
    ADMIN_UPDATE_ORDER_TIMELINE_STATUS,
  );

  useEffect(() => {
    if (order) {
      setStatus("");
      setMessage("");
      fetchTimeline({ variables: { orderNo: order.orderNo } });
    }
  }, [order, fetchTimeline]);

  const timeline = data?.adminOrderTimeline;
  const hasNext = timeline?.steps.some((s) => s.state === "NEXT") ?? false;

  const submit = async () => {
    if (!order || !status) return;
    try {
      await updateStatus({
        variables: {
          orderNo: order.orderNo,
          status,
          message: message.trim() || undefined,
        },
      });
      toast.success("Order status updated");
      onUpdated();
      onClose();
    } catch (e: any) {
      toast.error(e?.message ?? "Could not update the status");
    }
  };

  return (
    <ModalShell isOpen={!!order} onClose={onClose} title="Update Order Status">
      {order && (
        <div className="flex flex-col gap-5">
          <div>
            <p className="text-xs font-semibold text-gray-500">
              Current Order Status
            </p>
            <p className="mt-1 text-base font-semibold text-[rgb(33,76,123)]">
              {order.timelineLabel ?? "No timeline"}
            </p>
            <p className="mt-0.5 font-mono text-xs text-gray-400">
              {order.orderNo}
            </p>
          </div>

          {loading && !timeline ? (
            <p className="text-sm text-gray-400">Loading timeline...</p>
          ) : timeline ? (
            <>
              <ol className="flex flex-col gap-2">
                {timeline.steps.map((s) => (
                  <li
                    key={s.status}
                    className="flex items-center gap-2 text-sm"
                  >
                    <span
                      className={`flex h-5 w-5 items-center justify-center rounded-full border text-[10px] ${
                        s.state === "DONE" || s.state === "CURRENT"
                          ? "border-[rgb(33,76,123)] bg-[rgb(33,76,123)] text-white"
                          : s.state === "NEXT"
                            ? "border-[rgb(33,76,123)] text-[rgb(33,76,123)]"
                            : "border-gray-300 text-gray-300"
                      }`}
                    >
                      {s.state === "DONE" || s.state === "CURRENT" ? (
                        <Check size={11} />
                      ) : (
                        s.position
                      )}
                    </span>
                    <span
                      className={
                        s.state === "LOCKED" ? "text-gray-400" : "text-gray-800"
                      }
                    >
                      {s.label}
                    </span>
                    {s.state === "CURRENT" && (
                      <span className="rounded bg-blue-50 px-1.5 text-[10px] font-semibold text-[rgb(33,76,123)]">
                        CURRENT
                      </span>
                    )}
                    {s.state === "NEXT" && (
                      <span className="rounded bg-green-50 px-1.5 text-[10px] font-semibold text-green-700">
                        NEXT
                      </span>
                    )}
                  </li>
                ))}
              </ol>

              {hasNext ? (
                <>
                  <div className="flex flex-col gap-1.5">
                    <Label>Select New Status</Label>
                    <select
                      title="new status"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className={fieldClass}
                    >
                      <option value="">Select status</option>
                      {timeline.steps.map((s) => (
                        <option
                          key={s.status}
                          value={s.status}
                          disabled={s.state !== "NEXT"}
                        >
                          {s.label}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-400">
                      Only the next step can be selected. Steps cannot be
                      skipped.
                    </p>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <Label>Message (optional)</Label>
                    <textarea
                      rows={2}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Shown to the customer on the timeline"
                      className={fieldClass}
                    />
                  </div>
                </>
              ) : (
                <p className="rounded-lg bg-green-50 px-3 py-2 text-sm font-medium text-green-700">
                  This order&apos;s timeline is complete.
                </p>
              )}
            </>
          ) : null}

          <div className="flex justify-end gap-2">
            <Button variant="outline" size="md" onClick={onClose}>
              Close
            </Button>
            {hasNext && (
              <Button size="md" onClick={submit} disabled={!status || saving}>
                {saving ? "Updating..." : "Update Status"}
              </Button>
            )}
          </div>
        </div>
      )}
    </ModalShell>
  );
};
