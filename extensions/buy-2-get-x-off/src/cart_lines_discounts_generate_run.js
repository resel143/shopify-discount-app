// @ts-check
import { ProductDiscountSelectionStrategy } from "../generated/api";

/**
 * @typedef {import("../generated/api").RunInput} RunInput
 * @typedef {import("../generated/api").CartLinesDiscountsGenerateRunResult} CartLinesDiscountsGenerateRunResult
 */

/**
 * @type {CartLinesDiscountsGenerateRunResult}
 */
const EMPTY_DISCOUNT = {
  operations: [],
};

/**
 * @param {RunInput} input
 * @returns {CartLinesDiscountsGenerateRunResult}
 */
export function run(input) {
  // 1. Parse configuration from the Shop Metafield (saved by your Admin UI)
  const config = JSON.parse(
    input.shop?.metafield?.value || "{}"
  );

  const { products, percentOff, minQty = 2 } = config;

  // 2. Guards: If no products or percent configured, return no discount
  if (!products || !products.length || !percentOff || !input.cart.lines.length) {
    return EMPTY_DISCOUNT;
  }

  // 3. Find eligible cart lines based on your Admin selection
  const candidates = input.cart.lines
    .filter((line) => {
      const productId = line.merchandise.__typename === "ProductVariant" 
        ? line.merchandise.product.id 
        : null;
        
      // Check if product is in the list AND quantity is at least the minimum
      return products.includes(productId) && line.quantity >= minQty;
    })
    .map((line) => ({
      message: `Buy ${minQty}, get ${percentOff}% off`,
      targets: [
        {
          cartLine: {
            id: line.id,
          },
        },
      ],
      value: {
        percentage: {
          value: parseFloat(percentOff),
        },
      },
    }));

  if (!candidates.length) {
    return EMPTY_DISCOUNT;
  }

  // 4. Apply the discount operations
  return {
    operations: [
      {
        productDiscountsAdd: {
          candidates,
          selectionStrategy: ProductDiscountSelectionStrategy.All,
        },
      },
    ],
  };
}