export interface DiscountCalculation {
  originalPrice: number;
  discountPercent: number;
  discountAmount: number;
  priceAfterDiscount: number;
  taxPercent: number;
  taxAmount: number;
  finalPrice: number;
  totalSaved: number;
}

export interface DiscountResult {
  data: DiscountCalculation | null;
  error: string | null;
}

/**
 * Calculates discount and optional post-discount sales tax.
 */
export function calculateDiscount(
  originalPrice: number,
  discountPercent: number,
  taxPercent = 0
): DiscountResult {
  if (!Number.isFinite(originalPrice) || !Number.isFinite(discountPercent)) {
    return { data: null, error: 'Please enter valid numerical values.' };
  }
  if (originalPrice < 0) {
    return { data: null, error: 'Original price cannot be negative.' };
  }
  if (discountPercent < 0 || discountPercent > 100) {
    return { data: null, error: 'Discount percentage must be between 0% and 100%.' };
  }
  if (taxPercent < 0) {
    return { data: null, error: 'Tax percentage cannot be negative.' };
  }

  const discountAmount = (originalPrice * discountPercent) / 100;
  const priceAfterDiscount = originalPrice - discountAmount;
  const taxAmount = (priceAfterDiscount * taxPercent) / 100;
  const finalPrice = priceAfterDiscount + taxAmount;
  const totalSaved = discountAmount;

  return {
    data: {
      originalPrice,
      discountPercent,
      discountAmount,
      priceAfterDiscount,
      taxPercent,
      taxAmount,
      finalPrice,
      totalSaved,
    },
    error: null,
  };
}
