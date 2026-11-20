"use client";
import React from "react";
import { useQuery } from "@apollo/client/react";
import { Label } from "@repo/ui";
import { GET_ASSESSMENTS } from "../../lib/graphql/queries/assessment.queries";
import { GET_BRANDS_BY_CATEGORY_ID } from "../../lib/graphql/queries/brand.queries";

interface Props {
  assessmentId: string;
  strategy: string; // ALL | INCLUDE | EXCLUDE
  selectedIds: string[];
  onToggle: (brandId: string) => void;
}

// Lists the brands of the ASSESSMENT's category, so only matching brands show.
export const BrandPicker: React.FC<Props> = ({
  assessmentId,
  strategy,
  selectedIds,
  onToggle,
}) => {
  const { data: assessmentData, loading: assessmentsLoading } =
    useQuery<any>(GET_ASSESSMENTS);

  const assessment = (assessmentData?.getAssessments?.items ?? []).find(
    (a: any) => a.id === assessmentId,
  );
  const categoryId: string | undefined =
    assessment?.categoryId ?? assessment?.category?.id;
  const categoryName: string | undefined = assessment?.category?.name;

  const { data, loading, error } = useQuery<any>(GET_BRANDS_BY_CATEGORY_ID, {
    variables: { categoryId },
    skip: !categoryId,
    fetchPolicy: "cache-and-network",
  });
  const brands: any[] = data?.getBrandsByCategoryId ?? [];

  if (strategy === "ALL") return null;

  let body: React.ReactNode;

  if (!assessmentId) {
    body = (
      <p className="text-sm text-gray-500">
        Please select an assessment first.
      </p>
    );
  } else if (assessmentsLoading && !assessment) {
    body = <p className="text-sm text-gray-500">Loading assessment...</p>;
  } else if (!categoryId) {
    body = (
      <p className="text-sm text-red-500">
        Could not find the category of this assessment.
      </p>
    );
  } else if (error) {
    body = <p className="text-sm text-red-500">{error.message}</p>;
  } else if (loading && brands.length === 0) {
    body = <p className="text-sm text-gray-500">Loading brands...</p>;
  } else if (brands.length === 0) {
    body = (
      <p className="text-sm text-gray-500">
        No brands found for category {categoryName ?? categoryId}.
      </p>
    );
  } else {
    body = (
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-h-48 overflow-y-auto p-1">
        {brands.map((brand: any) => (
          <label
            key={brand.id}
            className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer hover:bg-white p-2 rounded-md transition-colors"
          >
            <input
              type="checkbox"
              checked={selectedIds.includes(brand.id)}
              onChange={() => onToggle(brand.id)}
              className="w-4 h-4 rounded border-gray-300 text-[rgb(33,76,123)] focus:ring-[rgb(33,76,123)]"
            />
            {brand.name}
          </label>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
      <Label>
        Select Brands to {strategy === "INCLUDE" ? "Include" : "Exclude"}
        {categoryName ? ` (${categoryName})` : ""}
      </Label>
      {body}
    </div>
  );
};
