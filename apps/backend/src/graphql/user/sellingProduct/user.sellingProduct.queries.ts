export const queries = `#graphql
  getSellingProductsByBrand(
    brandSeoName: String!
    categorySeoName: String!
    skip: Int
    take: Int
  ): SellingProductPage!

  getSellingProductBySeoName(seoName: String!): SellingProduct!
`;
