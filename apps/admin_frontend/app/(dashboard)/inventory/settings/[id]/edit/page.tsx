"use client";
import { use } from "react";
import { useQuery } from "@apollo/client/react";
import { PageHeader } from "../../../../../../components/ui/PageHeader";
import { SettingsForm } from "../../create/components/SettingsForm";
import { GET_INVOICE_SETTINGS_BY_ID } from "../../../../../../lib/graphql/queries/invoiceSettings.queries";
import { GetInvoiceSettingsByIdResponse } from "../../types";

export default function EditInvoiceSettingsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const { data, loading } = useQuery<GetInvoiceSettingsByIdResponse>(
    GET_INVOICE_SETTINGS_BY_ID,
    {
      variables: { id },
      skip: !id,
    },
  );

  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <div className="w-7 h-7 border-[3px] border-gray-200 border-t-[rgb(33,76,123)] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Edit Invoice Settings"
        breadcrumbs={[
          { label: "Inventory" },
          { label: "Settings", href: "/inventory/settings" },
          { label: "Edit" },
        ]}
      />
      <SettingsForm
        mode="edit"
        settingsId={id}
        initialData={data?.getInvoiceSettingsById}
      />
    </div>
  );
}
