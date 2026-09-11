export const typeDefs = `#graphql
enum BuyingProductSection {
  TOP_SELLING
  TOP_SELLING_APPLE
  TOP_SELLING_NON_APPLE
  GAMING_LAPTOPS
  TRENDING
  MOST_LOVED
  PEOPLE_LOVE
  MEGA_DHAMAKA
  LUXE
}
enum WarrantyType {
  HELLOFI_WARRANTY
  BRAND_WARRANTY
  NO_WARRANTY
}

input BuyingProductFilterInput {
  categorySlugs: [String!]
  brands: [String!]
  storages: [String!]
  rams: [String!]
  battery: [String!]
  screenSizes: [String!]
  warrantyTypes: [WarrantyType!]
  conditions: [BuyingCondition!]
  osList: [BuyingOS!]
  priceMin: Float
  priceMax: Float
  sort: ProductSortOption
  cursor: String
  limit: Int
}

enum ProductSortOption {
  NEWEST
  PRICE_ASC
  PRICE_DESC
}

type PaginatedBuyingProducts {
  items: [BuyingProductCard!]!
  nextCursor: String
  hasMore: Boolean!
}

type BuyingProductCard {
  id: ID!
  productName: String!
  productSubtitle: String!
  slug: String!
  brandId: String
  manualBrand: String
  categoryId: String!
  brand: Brand
  category: Category
  price: Float!
  mrp: Float!
  emiBasePrice: Float
  condition: BuyingCondition!
  storage: String
  warrantyType: BuyingWarrantyType!
  variantSku: String!
  image: BuyingProductImage
  createdAt: DateTime!
  updatedAt: DateTime!
}


type BrandFilterOption {
  id: ID
  name: String!
}

type PriceRange {
  min: Float
  max: Float
}

type AvailableFilters {
  storages: [String!]!
  rams: [String!]!
  conditions: [BuyingCondition!]!
  osList: [BuyingOS!]!
  screenSizes: [String!]!
  processors: [String!]!
  batteryCapacities: [String!]!
  warrantyTypes: [BuyingWarrantyType!]!
  brands: [BrandFilterOption!]!
  priceRange: PriceRange!
}type BrandFilterOption {
  id: ID
  name: String!
}

type CategoryFilterOption {
  id: ID!
  name: String!
  seoName: String!
}

type PriceRange {
  min: Float
  max: Float
}

type AvailableFilters {
  categories: [CategoryFilterOption!]!
  storages: [String!]!
  rams: [String!]!
  conditions: [BuyingCondition!]!
  osList: [BuyingOS!]!
  screenSizes: [String!]!
  processors: [String!]!
  batteryCapacities: [String!]!
  warrantyTypes: [BuyingWarrantyType!]!
  brands: [BrandFilterOption!]!
  priceRange: PriceRange!
}
`;
