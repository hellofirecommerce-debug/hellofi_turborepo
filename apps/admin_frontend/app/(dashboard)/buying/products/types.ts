export interface BuyingProductImage {
  id: string;
  variantId: string; // ← required, no productId
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
  sku: string; // ← keep, auto-generated in backend
  variantSubtitle: string; // ← required
  inventoryProductId?: string; // ← add
  inventoryProduct?: {
    // ← add
    id: string;
    productName: string;
    imeiOrSerial: string;
    status: string;
  };
  liveLink?: string;
  color?: string;
  colorCode?: string;
  storage?: string; // ← optional
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
  brandId?: string; // ← optional
  manualBrand?: string; // ← add
  categoryId: string;
  isTrending: boolean;
  brand?: { id: string; name: string }; // ← optional
  category: { id: string; name: string };
  variants: BuyingVariant[];
  specifications: BuyingSpecification[];
  // ← no images at product level
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

export interface VariantImageEntry {
  file: File | null;
  preview: string;
  s3Key?: string;
  isExisting?: boolean;
}

export interface VariantImageState {
  images: VariantImageEntry[];
  defaultImageIndex: number;
}
