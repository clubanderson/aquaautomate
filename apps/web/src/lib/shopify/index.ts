import { PRODUCTS_PER_PAGE } from "@/lib/constants";
import { shopifyFetch } from "./storefront";
import {
  GET_PRODUCTS_QUERY,
  GET_PRODUCT_BY_HANDLE_QUERY,
  GET_COLLECTIONS_QUERY,
  GET_COLLECTION_BY_HANDLE_QUERY,
  CREATE_CART_MUTATION,
  ADD_TO_CART_MUTATION,
  UPDATE_CART_LINES_MUTATION,
  REMOVE_FROM_CART_MUTATION,
} from "./queries";
import type {
  ShopifyProduct,
  ShopifyCollection,
  ShopifyCart,
} from "./types";

/** Shopify Storefront API max items per request */
const SHOPIFY_MAX_PER_PAGE = 250;

/* ---------- Products ---------- */

export async function getProducts(
  count: number = PRODUCTS_PER_PAGE
): Promise<ShopifyProduct[]> {
  const data = await shopifyFetch<{
    products: {
      edges: { node: ShopifyProduct }[];
      pageInfo: { hasNextPage: boolean; endCursor: string };
    };
  }>({
    query: GET_PRODUCTS_QUERY,
    variables: { first: Math.min(count, SHOPIFY_MAX_PER_PAGE) },
  });
  return (data.products?.edges ?? []).map((e) => e.node);
}

interface ProductsResponse {
  products: {
    edges: { node: ShopifyProduct }[];
    pageInfo: { hasNextPage: boolean; endCursor: string };
  };
}

/**
 * Fetch ALL products from Shopify, paginating through results.
 * Use for pages that need the full catalog (e.g. collections grouped by type).
 */
export async function getAllProducts(): Promise<ShopifyProduct[]> {
  const all: ShopifyProduct[] = [];
  let cursor: string | null = null;
  let hasNext = true;

  while (hasNext) {
    const result: ProductsResponse = await shopifyFetch<ProductsResponse>({
      query: GET_PRODUCTS_QUERY,
      variables: { first: SHOPIFY_MAX_PER_PAGE, ...(cursor ? { after: cursor } : {}) },
    });

    const edges = result.products?.edges ?? [];
    all.push(...edges.map((e) => e.node));
    hasNext = result.products?.pageInfo?.hasNextPage ?? false;
    cursor = result.products?.pageInfo?.endCursor ?? null;
  }

  return all;
}

export async function getProductByHandle(
  handle: string
): Promise<ShopifyProduct | null> {
  const data = await shopifyFetch<{
    productByHandle: ShopifyProduct | null;
  }>({
    query: GET_PRODUCT_BY_HANDLE_QUERY,
    variables: { handle },
  });
  return data.productByHandle ?? null;
}

/* ---------- Collections ---------- */

export async function getCollections(
  count: number = PRODUCTS_PER_PAGE
): Promise<ShopifyCollection[]> {
  const data = await shopifyFetch<{
    collections: { edges: { node: ShopifyCollection }[] };
  }>({
    query: GET_COLLECTIONS_QUERY,
    variables: { first: count },
  });
  return (data.collections?.edges ?? []).map((e) => e.node);
}

export async function getCollectionByHandle(
  handle: string,
  productCount: number = PRODUCTS_PER_PAGE
): Promise<ShopifyCollection | null> {
  const data = await shopifyFetch<{
    collectionByHandle: ShopifyCollection | null;
  }>({
    query: GET_COLLECTION_BY_HANDLE_QUERY,
    variables: { handle, first: productCount },
  });
  return data.collectionByHandle ?? null;
}

/* ---------- Cart ---------- */

export async function createCart(
  lines: { merchandiseId: string; quantity: number }[]
): Promise<ShopifyCart> {
  const data = await shopifyFetch<{
    cartCreate: { cart: ShopifyCart };
  }>({
    query: CREATE_CART_MUTATION,
    variables: { lines },
  });
  return data.cartCreate.cart;
}

export async function addToCart(
  cartId: string,
  lines: { merchandiseId: string; quantity: number }[]
): Promise<ShopifyCart> {
  const data = await shopifyFetch<{
    cartLinesAdd: { cart: ShopifyCart };
  }>({
    query: ADD_TO_CART_MUTATION,
    variables: { cartId, lines },
  });
  return data.cartLinesAdd.cart;
}

export async function updateCartLines(
  cartId: string,
  lines: { id: string; quantity: number }[]
): Promise<ShopifyCart> {
  const data = await shopifyFetch<{
    cartLinesUpdate: { cart: ShopifyCart };
  }>({
    query: UPDATE_CART_LINES_MUTATION,
    variables: { cartId, lines },
  });
  return data.cartLinesUpdate.cart;
}

export async function removeFromCart(
  cartId: string,
  lineIds: string[]
): Promise<ShopifyCart> {
  const data = await shopifyFetch<{
    cartLinesRemove: { cart: ShopifyCart };
  }>({
    query: REMOVE_FROM_CART_MUTATION,
    variables: { cartId, lineIds },
  });
  return data.cartLinesRemove.cart;
}
