"use client";
import React from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { PageHeader } from "../../../../../../components/ui/PageHeader";
import { ConditionForm } from "../../components/ConditionForm";
import { GET_CONDITION_BY_ID } from "../../../../../../lib/graphql/queries/condition.queries";
import { UPDATE_CONDITION } from "../../../../../../lib/graphql/mutations/condition.mutations";

export default function EditConditionPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const { data, loading: fetching } = useQuery<any>(GET_CONDITION_BY_ID, {
    variables: { id },
    fetchPolicy: "network-only",
  });

  const [update, { loading }] = useMutation(UPDATE_CONDITION, {
    onCompleted() {
      toast.success("Condition updated");
      router.push("/questionaries/conditions");
    },
    onError(err) {
      toast.error(err.message);
    },
  });

  const condition = data?.getConditionById;

  if (fetching) return <div className="p-8">Loading...</div>;
  if (!condition) return <div className="p-8">Not found</div>;

  // temporary: remove after checking
  console.log("EDIT isRequired/icon:", condition.isRequired, condition.icon);

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title={`Edit ${condition.title}`}
        breadcrumbs={[
          { label: "Questionaries" },
          { label: "Conditions", href: "/questionaries/conditions" },
          { label: "Edit" },
        ]}
      />
      <ConditionForm
        key={condition.id}
        isEdit
        isLoading={loading}
        initialData={condition}
        onSubmit={(formData, image) => {
          update({
            variables: {
              input: { id: condition.id, ...formData },
              image,
            },
          });
        }}
      />
    </div>
  );
}
