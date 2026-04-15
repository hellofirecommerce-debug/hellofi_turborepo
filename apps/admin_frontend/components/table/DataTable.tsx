"use client";
import React, { useState, useMemo } from "react";
import { Table } from "./Table";
import { TableHeader } from "./TableHeader";
import { TableBody } from "./TableBody";
import { TableRow } from "./TableRow";
import { TableCell } from "./TableCell";
import { TableFilter, FilterConfig } from "./TableFilter";
import { Pagination } from "./Pagination";
import { SortableHeader } from "./SortableHeader";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@repo/ui";

interface Employee {
  id: number;
  name: string;
  position: string;
  office: string;
  age: number;
  startDate: string;
  salary: number;
}

const sampleEmployees: Employee[] = [
  {
    id: 1,
    name: "Anil Kumar",
    position: "Sales Assistant",
    office: "Bangalore",
    age: 35,
    startDate: "2022-04-01",
    salary: 42000,
  },
  {
    id: 2,
    name: "Priya Sharma",
    position: "Tech Lead",
    office: "Bhubaneswar",
    age: 29,
    startDate: "2021-08-15",
    salary: 85000,
  },
  {
    id: 3,
    name: "Rahul Das",
    position: "Operations Manager",
    office: "Agartala",
    age: 41,
    startDate: "2020-01-10",
    salary: 95000,
  },
  {
    id: 4,
    name: "Sneha Patel",
    position: "Sales Assistant",
    office: "Bangalore",
    age: 27,
    startDate: "2023-03-20",
    salary: 38000,
  },
  {
    id: 5,
    name: "Vikram Singh",
    position: "Warehouse Lead",
    office: "Bhubaneswar",
    age: 33,
    startDate: "2022-11-05",
    salary: 55000,
  },
  {
    id: 6,
    name: "Meena Nair",
    position: "Customer Support",
    office: "Bangalore",
    age: 25,
    startDate: "2023-07-01",
    salary: 32000,
  },
  {
    id: 7,
    name: "Deepak Roy",
    position: "Tech Lead",
    office: "Agartala",
    age: 38,
    startDate: "2019-06-12",
    salary: 90000,
  },
  {
    id: 8,
    name: "Kavitha R",
    position: "Sales Assistant",
    office: "Bangalore",
    age: 30,
    startDate: "2022-09-01",
    salary: 40000,
  },
];

const filterConfig: FilterConfig[] = [
  { key: "search", type: "search", label: "Search" },
  {
    key: "office",
    type: "multiselect",
    label: "Office",
    options: [
      { label: "Bangalore", value: "Bangalore" },
      { label: "Bhubaneswar", value: "Bhubaneswar" },
      { label: "Agartala", value: "Agartala" },
    ],
  },
  {
    key: "position",
    type: "select",
    label: "Position",
    options: [
      { label: "Sales Assistant", value: "Sales Assistant" },
      { label: "Tech Lead", value: "Tech Lead" },
      { label: "Operations Manager", value: "Operations Manager" },
      { label: "Warehouse Lead", value: "Warehouse Lead" },
    ],
  },
  { key: "startDate", type: "daterange", label: "Start Date" },
];

export const DataTable: React.FC = () => {
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [sort, setSort] = useState<{ key: string; dir: "asc" | "desc" } | null>(
    null,
  );
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const handleSort = (key: string) => {
    setSort((prev) =>
      prev?.key === key
        ? { key, dir: prev.dir === "asc" ? "desc" : "asc" }
        : { key, dir: "asc" },
    );
  };

  const filtered = useMemo(() => {
    let data = [...sampleEmployees];
    if (filters.search) {
      const q = filters.search.toLowerCase();
      data = data.filter(
        (e) =>
          e.name.toLowerCase().includes(q) ||
          e.position.toLowerCase().includes(q),
      );
    }
    if (filters.office?.length)
      data = data.filter((e) => filters.office.includes(e.office));
    if (filters.position)
      data = data.filter((e) => e.position === filters.position);
    if (filters.startDate_from)
      data = data.filter((e) => e.startDate >= filters.startDate_from);
    if (filters.startDate_to)
      data = data.filter((e) => e.startDate <= filters.startDate_to);
    if (sort) {
      data.sort((a, b) => {
        const av = (a as any)[sort.key];
        const bv = (b as any)[sort.key];
        return sort.dir === "asc" ? (av > bv ? 1 : -1) : av < bv ? 1 : -1;
      });
    }
    return data;
  }, [filters, sort]);

  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="flex items-center justify-between p-5 border-b border-gray-100">
        <div>
          <h2 className="text-base font-semibold text-gray-900">
            Team Members
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">
            {filtered.length} total employees
          </p>
        </div>
      </div>

      <div className="p-4 border-b border-gray-100">
        <TableFilter
          filters={filterConfig}
          values={filters}
          onChange={handleFilterChange}
          onReset={() => {
            setFilters({});
            setPage(1);
          }}
          searchPlaceholder="Search employees..."
          searchKey="search"
        />
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableCell isHeader>
              <SortableHeader
                label="Name"
                sortKey="name"
                currentSort={sort}
                onSort={handleSort}
              />
            </TableCell>
            <TableCell isHeader>
              <SortableHeader
                label="Position"
                sortKey="position"
                currentSort={sort}
                onSort={handleSort}
              />
            </TableCell>
            <TableCell isHeader>
              <SortableHeader
                label="Office"
                sortKey="office"
                currentSort={sort}
                onSort={handleSort}
              />
            </TableCell>
            <TableCell isHeader>
              <SortableHeader
                label="Age"
                sortKey="age"
                currentSort={sort}
                onSort={handleSort}
              />
            </TableCell>
            <TableCell isHeader>
              <SortableHeader
                label="Start Date"
                sortKey="startDate"
                currentSort={sort}
                onSort={handleSort}
              />
            </TableCell>
            <TableCell isHeader>
              <SortableHeader
                label="Salary"
                sortKey="salary"
                currentSort={sort}
                onSort={handleSort}
              />
            </TableCell>
            <TableCell isHeader>Action</TableCell>
          </TableHeader>
          <TableBody>
            {paginated.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-12 text-gray-400"
                >
                  No records found
                </TableCell>
              </TableRow>
            ) : (
              paginated.map((emp) => (
                <TableRow key={emp.id}>
                  <TableCell className="font-medium text-gray-800">
                    {emp.name}
                  </TableCell>
                  <TableCell className="text-gray-500">
                    {emp.position}
                  </TableCell>
                  <TableCell className="text-gray-500">{emp.office}</TableCell>
                  <TableCell className="text-gray-500">{emp.age}</TableCell>
                  <TableCell className="text-gray-500">
                    {new Date(emp.startDate).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </TableCell>
                  <TableCell className="font-medium text-gray-800">
                    ₹{emp.salary.toLocaleString("en-IN")}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 border border-gray-200 text-gray-500 hover:border-[rgb(33,76,123)] hover:text-[rgb(33,76,123)] hover:bg-blue-50"
                      >
                        <Pencil size={15} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 border border-gray-200 text-gray-500 hover:border-red-300 hover:text-red-500 hover:bg-red-50"
                      >
                        <Trash2 size={15} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Pagination
        currentPage={page}
        totalItems={filtered.length}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
      />
    </div>
  );
};
