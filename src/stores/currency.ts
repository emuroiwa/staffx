import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Currency } from '@/types/company'
import currencyService from '@/services/currency'

export const useCurrencyStore = defineStore('currency', () => {
  // State
  const currencies = ref<Currency[]>([])
  const userCurrency = ref<Currency | null>(null)
  const companyCurrency = ref<Currency | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const activeCurrencies = computed(() => 
    currencies.value.filter(currency => currency.is_active)
  )
  
  const getCurrencyByCode = computed(() => 
    (code: string) => currencies.value.find(currency => currency.code === code)
  )
  
  const getCurrencyByUuid = computed(() => 
    (uuid: string) => currencies.value.find(currency => currency.uuid === uuid)
  )

  const baseCurrency = computed(() => 
    currencies.value.find(currency => currency.code === 'USD')
  )

  // Current currency - prioritizes user currency, then company currency, then default ZAR
  const currentCurrency = computed(() => {
    return userCurrency.value || companyCurrency.value || {
      code: 'ZAR',
      symbol: 'R',
      display_name: 'South African Rand',
      is_active: true
    }
  })

  // Get current currency symbol
  const currentSymbol = computed(() => currentCurrency.value?.symbol || 'R')

  // Get current currency code
  const currentCode = computed(() => currentCurrency.value?.code || 'ZAR')

  // Actions
  async function fetchCurrencies() {
    loading.value = true
    error.value = null
    try {
      const response = await currencyService.getCurrencies()
      currencies.value = response.data
      return response.data
    } catch (err) {
      error.value = 'Failed to fetch currencies'
      console.error('Failed to fetch currencies:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchCurrency(uuid: string) {
    loading.value = true
    error.value = null
    try {
      const response = await currencyService.getCurrency(uuid)
      
      // Update or add currency in the list
      const index = currencies.value.findIndex(c => c.uuid === uuid)
      if (index !== -1) {
        currencies.value[index] = response.data
      } else {
        currencies.value.push(response.data)
      }
      
      return response.data
    } catch (err) {
      error.value = 'Failed to fetch currency'
      console.error('Failed to fetch currency:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  function clearCurrencies() {
    currencies.value = []
    error.value = null
  }

  // Set user/company currency from login data
  function setUserCurrency(currency: Currency | null) {
    userCurrency.value = currency
  }

  function setCompanyCurrency(currency: Currency | null) {
    companyCurrency.value = currency
  }

  // Initialize currency from user/company data
  function initializeCurrency(userData: any, companyData: any) {
    // Set user currency if available
    if (userData?.currency_uuid && currencies.value.length > 0) {
      const userCurrencyData = getCurrencyByUuid.value(userData.currency_uuid)
      if (userCurrencyData) {
        setUserCurrency(userCurrencyData)
      }
    }

    // Set company currency if available and no user currency
    if (!userCurrency.value && companyData?.currency_uuid && currencies.value.length > 0) {
      const companyCurrencyData = getCurrencyByUuid.value(companyData.currency_uuid)
      if (companyCurrencyData) {
        setCompanyCurrency(companyCurrencyData)
      }
    }
  }

  // Clear currency data on logout
  function clearUserData() {
    userCurrency.value = null
    companyCurrency.value = null
    error.value = null
  }

  return {
    // State
    currencies,
    userCurrency,
    companyCurrency,
    loading,
    error,

    // Getters
    activeCurrencies,
    getCurrencyByCode,
    getCurrencyByUuid,
    baseCurrency,
    currentCurrency,
    currentSymbol,
    currentCode,

    // Actions
    fetchCurrencies,
    fetchCurrency,
    clearCurrencies,
    setUserCurrency,
    setCompanyCurrency,
    initializeCurrency,
    clearUserData
  }
})