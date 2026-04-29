export const mutations = `#graphql
createBuyingProduct(
  input: CreateBuyingProductInput!
  productImages: [Upload!]
  productDefaultImageIndex: Int!
  variantImages: [VariantImageInput!]
): BuyingProduct!

  updateBuyingProduct(
    id: ID!
    input: UpdateBuyingProductInput!
  ): BuyingProduct!

  deleteBuyingProduct(id: ID!): DeleteResponse!

  addVariantToProduct(
  productId: ID!
  input: BuyingVariantInput!
  images: [Upload!]!
  defaultImageIndex: Int!
): BuyingVariant!

  deleteVariant(variantId: ID!): DeleteResponse!

  addVariantImages(
  variantId: ID!
  productId: ID!
  images: [Upload!]!
  defaultImageIndex: Int!
): BuyingProduct!

  deleteVariantImage(imageId: ID!): DeleteResponse!
`;
