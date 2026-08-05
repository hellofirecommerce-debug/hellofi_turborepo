export const typeDefs = `#graphql
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
  manualBrand: String
  categoryId: String!
  featuredSection: FeaturedSection
  isTrending: Boolean
  isTopSelling: Boolean
  isGaming: Boolean
  isMegaDhamaka: Boolean
  isLuxe: Boolean
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
  featuredSection: FeaturedSection
  isTrending: Boolean
  isTopSelling: Boolean
  isGaming: Boolean
  isMegaDhamaka: Boolean
  isLuxe: Boolean
  specifications: [BuyingSpecificationInput!]
  variants: [UpdateBuyingVariantInput!]
}

input BuyingProductFilterInput {
  search: String
  brandId: String
  categoryId: String
  featuredSection: FeaturedSection
  isTrending: Boolean
  isTopSelling: Boolean
  isGaming: Boolean
  isMegaDhamaka: Boolean
  isLuxe: Boolean
  availability: BuyingAvailability
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
