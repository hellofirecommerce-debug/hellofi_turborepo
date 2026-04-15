import React from "react";
import { Breadcrumb, BreadcrumbItem } from "@repo/ui";

interface PageHeaderProps {
  title: string;
  breadcrumbs: BreadcrumbItem[];
  homeHref?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  breadcrumbs,
  homeHref = "/home",
}) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-lg  lg:text-2xl font-bold text-gray-900">{title}</h1>
      <Breadcrumb items={breadcrumbs} homeHref={homeHref} showHome={true} />
    </div>
  );
};
