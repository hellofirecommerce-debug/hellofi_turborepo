"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@apollo/client/react";
import { Button, Accordion } from "@repo/ui";
import { toast } from "sonner";
import { CompanyInfoForm } from "./CompanyInfoForm";
import { DefaultTermsForm } from "./DefaultTermsForm";
import { BankDetailsForm } from "./BankDetailsForm";
import {
  CREATE_INVOICE_SETTINGS,
  UPDATE_INVOICE_SETTINGS,
} from "../../../../../../lib/graphql/mutations/invoiceSettings.mutations";

import {
  CreateInvoiceSettingsInput,
  UpdateInvoiceSettingsInput,
} from "@repo/validations";

const DEFAULT_BRAND_TERMS = `• GST is calculated on the marginal value.
• Device is sold with Brand Warranty (Please visit Brand Service Centre incase of any issues).
• Warranty will be void in case of Liquid or Physical Damage.
• We accept BuyBack only.
• Product taken out of our premises by the buyer in person or buyers representative shall not be taken back without any further internal issue assuming it has been physically checked by the said person in our office premises itself.`;

const DEFAULT_HELLOFI_TERMS = `• GST is calculated on the marginal value.
• {months} Month seller service warranty.
• Warranty will be void in case of Liquid or Physical Damage.
• We accept BuyBack only.
• Product taken out of our premises by the buyer in person or buyers representative shall not be taken back without any further internal issue assuming it has been physically checked by the said person in our office premises itself.`;

const DEFAULT_NONE_TERMS = `• GST is calculated on the marginal value.
• We accept BuyBack only.
• Product taken out of our premises by the buyer in person or buyers representative shall not be taken back without any further internal issue assuming it has been physically checked by the said person in our office premises itself.`;

const DEFAULT_BANK_DETAILS = `• Bank: ICICI Bank
• Account: 100805003848
• IFSC: ICIC0001008
• Branch: BANGALORE, KORAMANGALA`;

interface Props {
  mode?: "create" | "edit";
  settingsId?: string;
  initialData?: any;
}

export function SettingsForm({
  mode = "create",
  settingsId,
  initialData,
}: Props) {
  const router = useRouter();

  const [expanded, setExpanded] = useState({
    companyInfo: true,
    defaultTerms: false,
    bankDetails: false,
  });

  const toggle = (key: keyof typeof expanded) => {
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // ── Form state typed against schema inputs ──
  const [formData, setFormData] = useState<CreateInvoiceSettingsInput>({
    label: initialData?.label ?? "",
    isDefault: initialData?.isDefault ?? false,
    name: initialData?.name ?? "HelloFi Recommerce",
    address:
      initialData?.address ??
      "No 28, 1st Floor, 1st Main Road, 1st Block Koramangala, Near to Wipro Park, Bangalore - 560034 Karnataka",
    contact: initialData?.contact ?? "8150835583",
    email: initialData?.email ?? "contact@hellofi.in",
    gstin: initialData?.gstin ?? "29AAQFH3388A1Z4",
    logoUrl: initialData?.logoUrl ?? "",
    stampUrl: initialData?.stampUrl ?? "",
    defaultInvoiceTermsBrand:
      initialData?.defaultInvoiceTermsBrand ?? DEFAULT_BRAND_TERMS,
    defaultInvoiceTermsHellofi:
      initialData?.defaultInvoiceTermsHellofi ?? DEFAULT_HELLOFI_TERMS,
    defaultInvoiceTermsNone:
      initialData?.defaultInvoiceTermsNone ?? DEFAULT_NONE_TERMS,
    defaultBankDetails: initialData?.defaultBankDetails ?? DEFAULT_BANK_DETAILS,
  });

  const [createSettings, { loading: creating }] = useMutation(
    CREATE_INVOICE_SETTINGS,
    {
      onCompleted: () => {
        toast.success("Settings created successfully");
        router.push("/inventory/settings");
      },
    },
  );

  const [updateSettings, { loading: updating }] = useMutation(
    UPDATE_INVOICE_SETTINGS,
    {
      onCompleted: () => {
        toast.success("Settings updated successfully");
        router.push("/inventory/settings");
      },
    },
  );

  const isLoading = creating || updating;

  const handleSave = () => {
    if (mode === "edit" && settingsId) {
      const updateInput: UpdateInvoiceSettingsInput = {
        id: settingsId,
        ...formData,
      };
      updateSettings({ variables: { input: updateInput } });
    } else {
      createSettings({ variables: { input: formData } });
    }
  };

  const update = (key: keyof CreateInvoiceSettingsInput, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="flex flex-col gap-4 max-w-3xl">
      {/* Company Info */}
      <Accordion
        title="Company Information"
        isExpanded={expanded.companyInfo}
        onToggle={() => toggle("companyInfo")}
      >
        <CompanyInfoForm data={formData} onChange={(d) => setFormData(d)} />
      </Accordion>

      {/* Default Terms */}
      <Accordion
        title="Default Invoice Terms"
        isExpanded={expanded.defaultTerms}
        onToggle={() => toggle("defaultTerms")}
      >
        <DefaultTermsForm
          data={{
            defaultInvoiceTermsBrand: formData.defaultInvoiceTermsBrand,
            defaultInvoiceTermsHellofi: formData.defaultInvoiceTermsHellofi,
            defaultInvoiceTermsNone: formData.defaultInvoiceTermsNone,
          }}
          onChange={(d) => setFormData((prev) => ({ ...prev, ...d }))}
        />
      </Accordion>

      {/* Bank Details */}
      <Accordion
        title="Default Bank Details"
        isExpanded={expanded.bankDetails}
        onToggle={() => toggle("bankDetails")}
      >
        <BankDetailsForm
          value={formData.defaultBankDetails}
          onChange={(v) => update("defaultBankDetails", v)}
        />
      </Accordion>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2">
        <Button onClick={handleSave} disabled={isLoading}>
          {isLoading
            ? mode === "edit"
              ? "Saving..."
              : "Creating..."
            : mode === "edit"
              ? "Save Changes"
              : "Create Settings"}
        </Button>
        <Button
          variant="outline"
          onClick={() => router.push("/inventory/settings")}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}
