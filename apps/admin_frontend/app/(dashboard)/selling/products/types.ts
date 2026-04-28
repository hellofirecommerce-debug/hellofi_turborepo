export interface SellingVariant {
  id: string;
  sellingProductId: string;
  ram?: string;
  storage: string;
  productPrice: number;
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
  updatedAt: string;
}

export interface SellingProduct {
  id: string;
  productName: string;
  productSeoName: string;
  brandId: string;
  categoryId: string;
  seriesId: string;
  image: string;
  releasedYear?: number;
  launchedDate?: string;
  productPrice?: number;
  status: "ACTIVE" | "INACTIVE";
  hasVariants: boolean;
  isConstantRam: boolean;
  ram?: string;
  brand: { id: string; name: string };
  category: { id: string; name: string };
  series: { id: string; seriesName: string };
  variants: SellingVariant[];
  createdAt: string;
  updatedAt: string;
}

export interface SellingProductsResponse {
  items: SellingProduct[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface SellingProductFilter {
  search?: string;
  brandId?: string;
  categoryId?: string;
  seriesId?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}
