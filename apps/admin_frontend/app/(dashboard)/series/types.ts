export interface Series {
  id: string;
  brandId: string;
  categoryId: string;
  seriesName: string;
  status: "ACTIVE" | "INACTIVE";
  priority: number;
  brand: { id: string; name: string };
  category: { id: string; name: string };
  createdAt: string;
  updatedAt: string;
}

export interface SeriesResponse {
  items: Series[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface BrandOption {
  id: string;
  name: string;
}

export interface CategoryOption {
  id: string;
  name: string;
}
