export const mutations = `#graphql
  createBrand(input: BrandInput!, image: Upload!): Brand!
  updateBrand(id: ID!, input: BrandInput!, image: Upload): Brand!
  updateBrandImage(id: ID!, image: Upload!): Brand!
  deleteBrand(id: ID!): DeleteResponse!
  addBrandToCategory(input: BrandCategoryInput!): BrandCategory!
  updateBrandCategory(id: ID!, input: BrandCategoryInput!): BrandCategory!
  removeBrandFromCategory(brandId: ID!, categoryId: ID!): DeleteResponse!
`;
