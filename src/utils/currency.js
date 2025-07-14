/**
 * Format a number as currency using ZAR (South African Rand) as default
 * @param {number} amount - The amount to format
 * @param {string} currency - The currency code (default: ZAR)
 * @param {string} locale - The locale for formatting (default: en-ZA)
 * @returns {string} Formatted currency string
 */
export function formatCurrency(amount, currency = 'ZAR', locale = 'en-ZA') {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return formatCurrency(0, currency, locale)
  }
  
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount)
  } catch (error) {
    // Fallback formatting if Intl.NumberFormat fails
    return `R ${parseFloat(amount).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
  }
}

/**
 * Parse a currency string back to a number
 * @param {string} currencyString - The currency string to parse
 * @returns {number} The parsed number
 */
export function parseCurrency(currencyString) {
  if (!currencyString || typeof currencyString !== 'string') {
    return 0
  }
  
  // Remove currency symbols, spaces, and commas
  const cleanString = currencyString.replace(/[^0-9.-]/g, '')
  const parsed = parseFloat(cleanString)
  
  return isNaN(parsed) ? 0 : parsed
}

/**
 * Format a number with thousand separators (no currency symbol)
 * @param {number} amount - The amount to format
 * @param {number} decimals - Number of decimal places (default: 2)
 * @returns {string} Formatted number string
 */
export function formatNumber(amount, decimals = 2) {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return formatNumber(0, decimals)
  }
  
  return parseFloat(amount).toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}