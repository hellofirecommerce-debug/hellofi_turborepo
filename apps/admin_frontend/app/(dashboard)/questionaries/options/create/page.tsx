"use client";
import React from "react";
import { useMutation } from "@apollo/client/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { PageHeader } from "../../../../../components/ui/PageHeader";
import { OptionForm } from "../components/OptionForm";
import { CREATE_OPTION } from "../../../../../lib/graphql/mutations/option.mutations";

export default function CreateOptionPage() {
  const router = useRouter();
  const [create, { loading }] = useMutation(CREATE_OPTION, {
    onCompleted() {
      toast.success("Option created");
      router.push("/questionaries/options");
    },
    onError(err) {
      toast.error(err.message);
    },
  });

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="Add Option"
        breadcrumbs={[
          { label: "Questionaries" },
          { label: "Options", href: "/questionaries/options" },
          { label: "Add" },
        ]}
      />
      <OptionForm
        isLoading={loading}
        onSubmit={(data, image, _removeImage, resize) =>
          create({ variables: { input: data, image, resize } })
        }
      />
    </div>
  );
}
