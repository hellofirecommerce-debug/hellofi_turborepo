import { gql } from "@apollo/client";

export const CREATE_BUYING_PRODUCT = gql`
  mutation CreateBuyingProduct(
    $input: CreateBuyingProductInput!
    $variantImages: [VariantImageInput!]!
  ) {
    createBuyingProduct(input: $input, variantImages: $variantImages) {
      id
      productName
      slug
      brand {
        id
        name
      }
      category {
        id
        name
      }
      variants {
        id
        sku
        storage
        ram
        price
        mrp
        quantity
        condition
        warrantyType
        images {
          id
          xs
          isDefault
        }
      }
      createdAt
    }
  }
`;

export const UPDATE_BUYING_PRODUCT = gql`
  mutation UpdateBuyingProduct(
    $id: ID!
    $input: UpdateBuyingProductInput!
    $variantImages: [VariantImageInput!]
  ) {
    updateBuyingProduct(id: $id, input: $input, variantImages: $variantImages) {
      id
      productName
      productSubtitle
      slug
      brandId
      manualBrand
      categoryId
      isTrending
      brand {
        id
        name
      }
      category {
        id
        name
      }
      variants {
        id
        sku
        variantSubtitle
        storage
        ram
        price
        mrp
        quantity
        condition
        availability
        warrantyType
        color
        colorCode
        images {
          id
          xs
          sm
          md
          lg
          isDefault
          priority
        }
      }
      specifications {
        id
        key
        value
        group
        sortOrder
      }
    }
  }
`;

export const DELETE_BUYING_PRODUCT = gql`
  mutation DeleteBuyingProduct($id: ID!) {
    deleteBuyingProduct(id: $id) {
      id
      message
    }
  }
`;

export const ADD_VARIANT_TO_PRODUCT = gql`
  mutation AddVariantToProduct(
    $productId: ID!
    $input: BuyingVariantInput!
    $images: [Upload!]!
    $defaultImageIndex: Int!
  ) {
    addVariantToProduct(
      productId: $productId
      input: $input
      images: $images
      defaultImageIndex: $defaultImageIndex
    ) {
      id
      sku
      shortId
      storage
      ram
      price
      mrp
    }
  }
`;

export const DELETE_VARIANT = gql`
  mutation DeleteVariant($variantId: ID!) {
    deleteVariant(variantId: $variantId) {
      id
      message
    }
  }
`;

export const ADD_VARIANT_IMAGES = gql`
  mutation AddVariantImages(
    $variantId: ID!
    $productId: ID!
    $images: [Upload!]!
    $defaultImageIndex: Int!
  ) {
    addVariantImages(
      variantId: $variantId
      productId: $productId
      images: $images
      defaultImageIndex: $defaultImageIndex
    ) {
      id
      variants {
        id
        images {
          id
          xs
          sm
          md
          lg
          alt
          isDefault
        }
      }
    }
  }
`;

export const DELETE_VARIANT_IMAGE = gql`
  mutation DeleteVariantImage($imageId: ID!) {
    deleteVariantImage(imageId: $imageId) {
      id
      message
    }
  }
`;
