export const queries = `#graphql
getBuyingProductsBySection(
  section: BuyingProductSection!
  categorySlug: String
): [BuyingProductCard!]!
`;
