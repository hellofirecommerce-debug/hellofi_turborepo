"use client";
import dynamic from "next/dynamic";
import { InvoiceData } from "../page";
import { InvoiceCompanySettings } from "../../../settings/types";

const InvoicePreview = dynamic(
  () => import("./InvoicePreview").then((mod) => mod.InvoicePreview),
  { ssr: false },
);

interface InvoicePreviewWrapperProps {
  data: InvoiceData;
  selectedSettings?: InvoiceCompanySettings;
}

export function InvoicePreviewWrapper({
  data,
  selectedSettings,
}: InvoicePreviewWrapperProps) {
  return <InvoicePreview data={data} selectedSettings={selectedSettings} />;
}
