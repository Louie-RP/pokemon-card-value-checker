// Utility helpers extracted from CardSearch to keep component exports clean.

export const EUR_TO_USD = 1.08; // Update this rate as needed or make dynamic later.

export function eurToUsd(eur: number | null | undefined): number | null {
  if (typeof eur !== 'number' || isNaN(eur)) return null;
  return +(eur * EUR_TO_USD).toFixed(2);
}

export function formatPrice(price: number | null | undefined): string {
  if (typeof price !== 'number' || isNaN(price)) return 'N/A';
  return `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
