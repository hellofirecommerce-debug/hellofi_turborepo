export const queries = `#graphql
getFilteredBuyingProducts(filter: BuyingProductFilterInput): PaginatedBuyingProducts!
getBuyingProductsBySection(
  section: BuyingProductSection!
  categorySlug: String
): [BuyingProductCard!]!
getAvailableFilters(categorySlugs: [String!]): AvailableFilters!
`;
