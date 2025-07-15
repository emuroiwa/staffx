import { computed } from 'vue'
import { useCurrencyStore } from '@/stores/currency'
import { formatCurrency as utilFormatCurrency } from '@/utils/currency'

export function useCurrency() {
  const currencyStore = useCurrencyStore()

  // Current currency information
  const currentCurrency = computed(() => currencyStore.currentCurrency)
  const currentSymbol = computed(() => currencyStore.currentSymbol)
  const currentCode = computed(() => currencyStore.currentCode)

  // Format currency using current user/company currency
  const formatCurrency = (amount: number | string | null | undefined): string => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : (amount || 0)
    return utilFormatCurrency(numAmount, currentCode.value, 'en-ZA')
  }

  // Format currency with custom currency code
  const formatCurrencyWithCode = (amount: number | string | null | undefined, currencyCode: string): string => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : (amount || 0)
    return utilFormatCurrency(numAmount, currencyCode, 'en-ZA')
  }

  // Get currency symbol for a specific currency code
  const getCurrencySymbol = (currencyCode: string): string => {
    const currency = currencyStore.getCurrencyByCode(currencyCode)
    return currency?.symbol || currencyCode
  }

  // Format amount with just the symbol (no full currency formatting)
  const formatWithSymbol = (amount: number | string | null | undefined): string => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : (amount || 0)
    const formattedNumber = numAmount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    return `${currentSymbol.value}${formattedNumber}`
  }

  return {
    // Current currency info
    currentCurrency,
    currentSymbol,
    currentCode,

    // Formatting functions
    formatCurrency,
    formatCurrencyWithCode,
    formatWithSymbol,
    getCurrencySymbol,

    // Store access
    currencyStore
  }
}