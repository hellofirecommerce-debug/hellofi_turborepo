"use client";
import React from "react";
import { ModalShell } from "./ModalShell";
import { AdminSellingOrder } from "../types";

interface Props {
  order: AdminSellingOrder | null;
  onClose: () => void;
}

export const DeviceReportModal: React.FC<Props> = ({ order, onClose }) => (
  <ModalShell
    isOpen={!!order}
    onClose={onClose}
    title="Device Report"
    maxWidth="max-w-xl"
  >
    {order && (
      <div>
        <p className="mb-4 text-sm font-semibold text-[rgb(33,76,123)]">
          {order.productName}
          <span className="ml-2 font-mono text-xs font-normal text-gray-400">
            {order.orderNo}
          </span>
        </p>

        {order?.deviceReport?.length === 0 ? (
          <p className="text-sm text-gray-400">
            No device report available for this order.
          </p>
        ) : (
          <div className="flex flex-col gap-5">
            {order.deviceReport.map((s) => (
              <section key={s.stepId}>
                <h4 className="mb-2 text-sm font-bold text-gray-900">
                  {s.title}
                </h4>
                <ul className="flex flex-col gap-1.5">
                  {s.items.map((it) => (
                    <li key={it.conditionId} className="text-sm text-gray-700">
                      {it.question}{" "}
                      <span className="font-semibold text-[rgb(33,76,123)]">
                        {it.answer}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )}
      </div>
    )}
  </ModalShell>
);
