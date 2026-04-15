"use client";
import { pdfjs, Document, Page } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

import { InvoiceData } from "../page";
import { InvoiceCompanySettings } from "../../../settings/types";
import { useMounted, useResizeObserver } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { pdf } from "@react-pdf/renderer";
import { InvoiceDocument } from "./InvoiceDocument";

const PDF_VIEWER_PADDING = 18;

interface InvoicePreviewProps {
  data: InvoiceData;
  selectedSettings?: InvoiceCompanySettings; // ← add this
}

const PDFViewer = ({ url, width }: { url: string | null; width: number }) => {
  const [error, setError] = useState<Error | null>(null);
  const [numPages, setNumPages] = useState<number | null>(null);

  if (width === 0) width = 800;
  if (!url) return null;

  return (
    <div className="flex h-full w-full items-center justify-center">
      <Document
        file={url}
        loading={null}
        onLoadSuccess={({ numPages }) => setNumPages(numPages)}
        onLoadError={(err) => {
          console.error("[ERROR]: Error loading PDF:", err);
          setError(err);
        }}
        className="flex h-full max-h-full w-full flex-col items-center overflow-y-scroll py-4 gap-4 sm:items-start [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        {!error &&
          Array.from({ length: numPages ?? 1 }, (_, i) => (
            <Page
              key={i + 1}
              pageNumber={i + 1}
              width={
                width > 800
                  ? 800 - PDF_VIEWER_PADDING
                  : width - PDF_VIEWER_PADDING
              }
              renderTextLayer={false}
              renderAnnotationLayer={false}
            />
          ))}
      </Document>
    </div>
  );
};

export function InvoicePreview({
  data,
  selectedSettings,
}: InvoicePreviewProps) {
  const isClient = useMounted();
  const [resizeRef, container] = useResizeObserver();
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pdfError, setPdfError] = useState<string | null>(null);

  useEffect(() => {
    setPdfError(null);
    let objectUrl: string | null = null;

    (async () => {
      try {
        const blob = await pdf(
          <InvoiceDocument data={data} selectedSettings={selectedSettings} />, // ← pass here
        ).toBlob();
        objectUrl = URL.createObjectURL(blob);
        setPdfUrl(objectUrl);
      } catch (err) {
        console.error("[ERROR]: Failed to generate PDF:", err);
        setPdfError("Failed to generate PDF preview.");
        if (objectUrl) URL.revokeObjectURL(objectUrl);
      }
    })();

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [data, selectedSettings]); // ← add selectedSettings to deps

  if (pdfError) {
    return (
      <div className="flex h-full w-full items-center justify-center text-sm text-red-500">
        {pdfError}
      </div>
    );
  }

  return (
    <div
      ref={resizeRef}
      className="h-full w-full overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
    >
      {!isClient || !pdfUrl ? (
        <div className="flex h-full w-full items-center justify-center">
          <div className="w-7 h-7 border-[3px] border-gray-200 border-t-[rgb(33,76,123)] rounded-full animate-spin" />
        </div>
      ) : (
        <PDFViewer url={pdfUrl} width={container.width} />
      )}
    </div>
  );
}
