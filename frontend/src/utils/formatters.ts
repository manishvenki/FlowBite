/**
 * BiteFlow Currency & Number Formatters
 * Localized specifically for India (INR / ₹)
 */

export const formatCurrency = (amount: number): string => {
  const safeAmount = typeof amount === 'number' && !isNaN(amount) ? amount : 0;
  const isWhole = Number.isInteger(safeAmount);

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: isWhole ? 0 : 2,
    minimumFractionDigits: isWhole ? 0 : 2,
  }).format(safeAmount);
};

export const formatCompactInr = (amount: number): string => {
  const safeAmount = typeof amount === 'number' && !isNaN(amount) ? amount : 0;
  if (safeAmount >= 10000000) {
    return `₹${(safeAmount / 10000000).toFixed(1)}Cr`;
  }
  if (safeAmount >= 100000) {
    return `₹${(safeAmount / 100000).toFixed(1)}L`;
  }
  if (safeAmount >= 1000) {
    return `₹${(safeAmount / 1000).toFixed(1)}K`;
  }
  return formatCurrency(safeAmount);
};

export const formatRating = (rating: number): string => {
  return Number(rating || 0).toFixed(1);
};

export const truncateText = (text: string, maxLength: number = 80): string => {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};
