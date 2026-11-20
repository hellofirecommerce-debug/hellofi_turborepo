"use client";
import React, { Suspense, useMemo } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { PageHeader } from "../../../../../components/ui/PageHeader";
import { OptionForm } from "../components/OptionForm";
import { CREATE_OPTION } from "../../../../../lib/graphql/mutations/option.mutations";
import { GET_CONDITION_BY_ID } from "../../../../../lib/graphql/queries/condition.queries";

function CreateOptionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const conditionId = searchParams.get("conditionId");

  const { data, loading: fetching } = useQuery<any>(GET_CONDITION_BY_ID, {
    variables: { id: conditionId },
    skip: !conditionId,
  });

  const [create, { loading }] = useMutation(CREATE_OPTION, {
    onCompleted() {
      toast.success("Option created");
      router.push("/questionaries/options");
    },
    onError(err) {
      toast.error(err.message);
    },
  });

  const condition = data?.getConditionById;

  // memoised so the form's reset effect does not run on every render
  const prefill = useMemo(
    () =>
      condition
        ? { conditionId: condition.id, condition: { step: condition.step } }
        : undefined,
    [condition],
  );

  if (conditionId && fetching) return <div className="p-8">Loading...</div>;

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
        initialData={prefill}
        isLoading={loading}
        onSubmit={(data, image, _removeImage, resize) =>
          create({ variables: { input: data, image, resize } })
        }
      />
    </div>
  );
}

export default function CreateOptionPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading...</div>}>
      <CreateOptionContent />
    </Suspense>
  );
}
