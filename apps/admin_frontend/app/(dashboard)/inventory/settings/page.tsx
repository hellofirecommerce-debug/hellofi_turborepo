"use client";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "@apollo/client/react";
import { useEffect, useState } from "react";
import { PageHeader } from "../../../../components/ui/PageHeader";
import { Button } from "@repo/ui";
import { Plus, Pencil, Star, Trash2 } from "lucide-react";
import { GET_ALL_INVOICE_SETTINGS } from "../../../../lib/graphql/queries/invoiceSettings.queries";
import {
  DELETE_INVOICE_SETTINGS,
  SET_DEFAULT_INVOICE_SETTINGS,
} from "../../../../lib/graphql/mutations/invoiceSettings.mutations";
import { InvoiceCompanySettings, GetAllInvoiceSettingsResponse } from "./types";
import { toast } from "sonner";

export default function InvoiceSettingsPage() {
  const router = useRouter();

  const { data, loading } = useQuery<GetAllInvoiceSettingsResponse>(
    GET_ALL_INVOICE_SETTINGS,
    { fetchPolicy: "cache-and-network" },
  );

  const [settings, setSettings] = useState<InvoiceCompanySettings[]>([]);

  useEffect(() => {
    if (data?.getInvoiceSettings) {
      setSettings(data.getInvoiceSettings);
    }
  }, [data]);

  const [deleteSettings] = useMutation(DELETE_INVOICE_SETTINGS, {
    onCompleted: (_, opts) => {
      const deletedId = opts?.variables?.id;
      setSettings((prev) => prev.filter((s) => s.id !== deletedId));
      toast.success("Settings deleted");
    },
  });

  const [setDefault] = useMutation<{
    setDefaultInvoiceSettings: InvoiceCompanySettings;
  }>(SET_DEFAULT_INVOICE_SETTINGS, {
    onCompleted: (res) => {
      const updatedId = res.setDefaultInvoiceSettings.id;
      setSettings((prev) =>
        prev.map((s) => ({ ...s, isDefault: s.id === updatedId })),
      );
      toast.success("Default settings updated");
    },
  });

  const handleDelete = (id: string) => {
    deleteSettings({ variables: { id } });
  };

  const handleSetDefault = (id: string) => {
    setDefault({ variables: { id } });
  };

  if (loading && settings.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center">
        <div className="w-7 h-7 border-[3px] border-gray-200 border-t-[rgb(33,76,123)] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Invoice Settings"
        breadcrumbs={[{ label: "Inventory" }, { label: "Settings" }]}
      />

      <div className="flex justify-end">
        <Button onClick={() => router.push("/inventory/settings/create")}>
          <Plus className="w-4 h-4" />
          Add Settings
        </Button>
      </div>

      <div className="flex flex-col gap-4">
        {settings.map((setting: InvoiceCompanySettings) => (
          <div
            key={setting.id}
            className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col gap-4"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-gray-900">
                  {setting.label}
                </h3>
                {setting.isDefault && (
                  <span className="flex items-center gap-1 text-xs font-medium text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                    <Star className="w-3 h-3" />
                    Default
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {!setting.isDefault && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSetDefault(setting.id)}
                  >
                    Set as Default
                  </Button>
                )}
                {!setting.isDefault && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(setting.id)}
                    className="text-red-400 hover:text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="flex flex-col gap-0.5">
                <span className="text-xs text-gray-400">Company Name</span>
                <span className="text-sm font-medium text-gray-800">
                  {setting.name}
                </span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-xs text-gray-400">GSTIN</span>
                <span className="text-sm font-medium text-gray-800">
                  {setting.gstin}
                </span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-xs text-gray-400">Contact</span>
                <span className="text-sm font-medium text-gray-800">
                  {setting.contact}
                </span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-xs text-gray-400">Email</span>
                <span className="text-sm font-medium text-gray-800">
                  {setting.email}
                </span>
              </div>
            </div>
          </div>
        ))}

        {settings.length === 0 && !loading && (
          <div className="bg-white rounded-xl border border-gray-200 p-10 flex flex-col items-center justify-center gap-3 min-h-[400px]">
            <p className="text-sm text-gray-500">No settings found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
