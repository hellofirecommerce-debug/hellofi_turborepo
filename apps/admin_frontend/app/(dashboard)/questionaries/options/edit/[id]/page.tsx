"use client";
import React from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { PageHeader } from "../../../../../../components/ui/PageHeader";
import { OptionForm } from "../../components/OptionForm";
import { GET_OPTION_BY_ID } from "../../../../../../lib/graphql/queries/option.queries";
import { UPDATE_OPTION } from "../../../../../../lib/graphql/mutations/option.mutations";

export default function EditOptionPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const { data, loading: fetching } = useQuery<any>(GET_OPTION_BY_ID, {
    variables: { id },
    fetchPolicy: "network-only",
  });

  const [update, { loading }] = useMutation(UPDATE_OPTION, {
    onCompleted() {
      toast.success("Option updated");
      router.push("/questionaries/options");
    },
    onError(err) {
      toast.error(err.message);
    },
  });

  const option = data?.getOptionById;
  if (fetching) return <div className="p-8">Loading...</div>;
  if (!option) return <div className="p-8">Not found</div>;

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title={`Edit ${option.label}`}
        breadcrumbs={[
          { label: "Questionaries" },
          { label: "Options", href: "/questionaries/options" },
          { label: "Edit" },
        ]}
      />
      <OptionForm
        isEdit
        isLoading={loading}
        initialData={option}
        onSubmit={(formData, image, removeImage, resize) => {
          const {
            id: _,
            condition,
            popupConditions,
            __typename,
            ...validData
          } = formData;

          update({
            variables: {
              input: { id, ...validData },
              image,
              removeImage,
              resize,
            },
          });
        }}
      />
    </div>
  );
}
