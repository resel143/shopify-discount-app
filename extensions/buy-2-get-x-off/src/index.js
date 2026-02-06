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
 * 1. Volume Discount Logic (Milestone C)
 * @param {RunInput} input
 * @returns {CartLinesDiscountsGenerateRunResult}
 */
export function cartLinesDiscountsGenerateRun(input) {
  const config = JSON.parse(input.shop?.metafield?.value || "{}");
  const { products, percentOff, minQty = 2 } = config;

  if (!products || !products.length || !percentOff || !input.cart.lines.length) {
    return EMPTY_DISCOUNT;
  }

  const candidates = input.cart.lines
    .filter((line) => {
      const productId = line.merchandise.__typename === "ProductVariant" 
        ? line.merchandise.product.id 
        : null;
      return products.includes(productId) && line.quantity >= minQty;
    })
    .map((line) => ({
      message: `Buy ${minQty}, get ${percentOff}% off`,
      targets: [{ cartLine: { id: line.id } }],
      value: { percentage: { value: parseFloat(percentOff) } },
    }));

  if (!candidates.length) return EMPTY_DISCOUNT;

  return {
    operations: [{
      productDiscountsAdd: {
        candidates,
        selectionStrategy: ProductDiscountSelectionStrategy.All,
      },
    }],
  };
}

/**
 * 2. Dummy Export for Delivery Options
 * This satisfies the build tool without adding extra logic.
 */
export function cartDeliveryOptionsDiscountsGenerateRun() {
  return { operations: [] };
}