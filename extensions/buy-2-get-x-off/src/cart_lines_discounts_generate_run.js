import {
  DiscountClass,
  ProductDiscountSelectionStrategy,
} from '../generated/api';

/**
 * @typedef {import("../generated/api").CartInput} RunInput
 * @typedef {import("../generated/api").CartLinesDiscountsGenerateRunResult} CartLinesDiscountsGenerateRunResult
 */

/**
 * @param {RunInput} input
 * @returns {CartLinesDiscountsGenerateRunResult}
 */
export function cartLinesDiscountsGenerateRun(input) {
  const config = {
    products: [
      "gid://shopify/Product/9323466948840",
    ],
    minQty: 2,
    percentOff: 10,
  };

  if (!input.cart.lines.length || !config.products.length) {
    return { operations: [] };
  }

  const hasProductDiscountClass =
    input.discount.discountClasses.includes(DiscountClass.Product);

  if (!hasProductDiscountClass) {
    return { operations: [] };
  }

  const candidates = [];

  for (const line of input.cart.lines) {
    const productId = line.merchandise.product.id;
    const quantity = line.quantity;

    const isEligibleProduct = config.products.includes(productId);
    const meetsQuantity = quantity >= config.minQty;

    if (isEligibleProduct && meetsQuantity) {
      candidates.push({
        message: `Buy ${config.minQty}, get ${config.percentOff}% off`,
        targets: [
          {
            cartLine: {
              id: line.id,
            },
          },
        ],
        value: {
          percentage: {
            value: config.percentOff,
          },
        },
      });
    }
  }

  if (!candidates.length) {
    return { operations: [] };
  }

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