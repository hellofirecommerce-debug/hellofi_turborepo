export const typeDefs = `#graphql
  enum BuyingCondition {
    UNBOXED
    SUPERB
    GOOD
    FAIR
    PARTIALLY_FAIR
  }

  enum BuyingAvailability {
    IN_STOCK
    OUT_OF_STOCK
  }

  enum BuyingOS {
    WINDOWS
    MACOS
  }

  enum BuyingWarrantyType {
    HELLOFI_WARRANTY
    BRAND_WARRANTY
    NO_WARRANTY
  }

  type BuyingProductImage {
  id: ID!
  variantId: String!
  xs: String
  sm: String
  md: String
  lg: String
  alt: String
  priority: Int!
  isDefault: Boolean!
  createdAt: DateTime!
  updatedAt: DateTime!
}
  type BuyingSpecification {
    id: ID!
    productId: String!
    key: String!
    value: String!
    group: String
    sortOrder: Int!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type BuyingVariant {
  id: ID!
  productId: String!
  sku: String!               # ← auto-generated in backend
  variantSubtitle: String! 
  inventoryProductId: String
  liveLink: String
  color: String
  colorCode: String
  storage: String
  ram: String
  price: Float!
  mrp: Float!
  emiBasePrice: Float
  quantity: Int!
  reservedQuantity: Int!
  productSpec: String
  condition: BuyingCondition!
  availability: BuyingAvailability!
  screenSize: String
  os: BuyingOS
  processor: String
  batteryCapacity: String
  warrantyType: BuyingWarrantyType!
  warrantyDescription: String
  whatsInTheBox: [String!]!
  whatsExtra: String
  images: [BuyingProductImage!]!
  createdAt: DateTime!
  updatedAt: DateTime!
}

type BuyingProduct {
  id: ID!
  productName: String!
  productSubtitle: String!
  slug: String!
  brandId: String
  manualBrand: String   # ← add
  categoryId: String!
  isTrending: Boolean!
  brand: Brand
  category: Category
  variants: [BuyingVariant!]!
  specifications: [BuyingSpecification!]!
  createdAt: DateTime!
  updatedAt: DateTime!
}
type BuyingProductsResponse {
  items: [BuyingProduct!]!
  total: Int!
  page: Int!
  pageSize: Int!
  totalPages: Int!
}

input BuyingSpecificationInput {
  key: String!
  value: String!
  group: String
  sortOrder: Int
}

input BuyingVariantInput {
  liveLink: String
  variantSubtitle: String!
  inventoryProductId: String
  color: String
  colorCode: String
  storage: String
  ram: String
  price: Float!
  mrp: Float!
  emiBasePrice: Float
  quantity: Int!
  productSpec: String
  condition: BuyingCondition!
  availability: BuyingAvailability
  screenSize: String
  os: BuyingOS
  processor: String
  batteryCapacity: String
  warrantyType: BuyingWarrantyType!
  warrantyDescription: String
  whatsInTheBox: [String!]
  whatsExtra: String
  variantKey: String
}

input CreateBuyingProductInput {
  productName: String!
  productSubtitle: String!
  slug: String!
  brandId: String
  manualBrand: String   # ← add
  categoryId: String!
  isTrending: Boolean
  specifications: [BuyingSpecificationInput!]
  variants: [BuyingVariantInput!]
}


input UpdateBuyingVariantInput {
  variantKey: String!
  liveLink: String
  variantSubtitle: String
  inventoryProductId: String
  color: String
  colorCode: String
  storage: String
  ram: String
  price: Float
  mrp: Float
  emiBasePrice: Float
  quantity: Int
  productSpec: String
  condition: BuyingCondition
  availability: BuyingAvailability
  screenSize: String
  os: BuyingOS
  processor: String
  batteryCapacity: String
  warrantyType: BuyingWarrantyType
  warrantyDescription: String
  whatsInTheBox: [String!]
  whatsExtra: String
}


input UpdateBuyingProductInput {
  productName: String
  productSubtitle: String
  slug: String
  brandId: String
  manualBrand: String
  categoryId: String
  isTrending: Boolean
  specifications: [BuyingSpecificationInput!]
  variants: [UpdateBuyingVariantInput!]
}


input BuyingProductFilterInput {
  search: String
  brandId: String
  categoryId: String
  isTrending: Boolean
  page: Int
  pageSize: Int
}



input VariantImageInput {
  variantKey: String!
  defaultImageIndex: Int!
  images: [Upload!]
  existingImageKeys: [String!]
}

`;
