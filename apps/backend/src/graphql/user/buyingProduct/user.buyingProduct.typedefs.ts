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
`;
