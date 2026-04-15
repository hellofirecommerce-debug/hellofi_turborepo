import { PageHeader } from "../../../../../components/ui/PageHeader";
import { SettingsForm } from "./components/SettingsForm";

export default function CreateInvoiceSettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Create Invoice Settings"
        breadcrumbs={[
          { label: "Inventory", href: "/inventory" },
          { label: "Invoices", href: "/inventory/invoices" },
          { label: "Settings", href: "/inventory/settings" },
          { label: "Create" },
        ]}
      />
      <SettingsForm mode="create" />
    </div>
  );
}
