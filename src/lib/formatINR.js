const inrFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 2,
});

const inrCompactFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  notation: 'compact',
  maximumFractionDigits: 1,
});

/** @param {number|string|null|undefined} amount */
export function parseAmount(amount) {
  if (amount == null || amount === '') return 0;
  const value = typeof amount === 'string' ? parseFloat(amount.replace(/,/g, '')) : Number(amount);
  return Number.isFinite(value) ? value : 0;
}

/** @param {number|string|null|undefined} amount */
export function formatINR(amount) {
  return inrFormatter.format(parseAmount(amount));
}

/** @param {number|string|null|undefined} amount */
export function formatINRCompact(amount) {
  return inrCompactFormatter.format(parseAmount(amount));
}

/** Chart axis — no currency symbol clutter on small ticks */
export function formatINRAxis(amount) {
  const value = parseAmount(amount);
  if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
  if (value >= 1000) return `₹${(value / 1000).toFixed(1)}K`;
  return `₹${Math.round(value)}`;
}
