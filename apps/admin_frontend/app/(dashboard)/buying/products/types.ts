export interface BuyingProductImage {
  id: string;
  productId?: string;
  variantId?: string;
  xs?: string;
  sm?: string;
  md?: string;
  lg?: string;
  alt?: string;
  priority: number;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BuyingSpecification {
  id: string;
  productId: string;
  key: string;
  value: string;
  group?: string;
  sortOrder: number;
}

export interface BuyingVariant {
  id: string;
  productId: string;
  sku: string;
  shortId: string;
  liveLink?: string;
  variantSubtitle?: string;
  color?: string;
  colorCode?: string;
  storage: string;
  ram?: string;
  price: number;
  mrp: number;
  emiBasePrice?: number;
  quantity: number;
  reservedQuantity: number;
  productSpec?: string;
  condition: "UNBOXED" | "SUPERB" | "GOOD" | "FAIR" | "PARTIALLY_FAIR";
  availability: "IN_STOCK" | "OUT_OF_STOCK";
  screenSize?: string;
  os?: "WINDOWS" | "MACOS";
  processor?: string;
  batteryCapacity?: string;
  warrantyType: "HELLOFI_WARRANTY" | "BRAND_WARRANTY" | "NO_WARRANTY";
  warrantyDescription?: string;
  whatsInTheBox: string[];
  whatsExtra?: string;
  images: BuyingProductImage[];
  createdAt: string;
  updatedAt: string;
}

export interface BuyingProduct {
  id: string;
  productName: string;
  productSubtitle: string;
  slug: string;
  brandId: string;
  categoryId: string;
  isTrending: boolean;
  brand: { id: string; name: string };
  category: { id: string; name: string };
  variants: BuyingVariant[];
  images: BuyingProductImage[];
  specifications: BuyingSpecification[];
  createdAt: string;
  updatedAt: string;
}

export interface BuyingProductsResponse {
  items: BuyingProduct[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface BuyingProductFilter {
  search?: string;
  brandId?: string;
  categoryId?: string;
  isTrending?: boolean;
  page?: number;
  pageSize?: number;
}
