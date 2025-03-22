/**
 * Shortens an Ethereum address to a more readable format
 * @param address The full Ethereum address
 * @param chars Number of characters to show at the beginning and end
 * @returns Shortened address string
 */
export function shortenAddress(address: string, chars = 4): string {
  if (!address) return ""
  return `${address.substring(0, chars + 2)}...${address.substring(42 - chars)}`
}

/**
 * Formats a number as currency
 * @param value The number to format
 * @param currency The currency symbol
 * @param decimals Number of decimal places
 * @returns Formatted currency string
 */
export function formatCurrency(value: number | string, currency = "$", decimals = 2): string {
  const numValue = typeof value === "string" ? Number.parseFloat(value) : value
  if (isNaN(numValue)) return `${currency}0.00`
  return `${currency}${numValue.toFixed(decimals)}`
}

