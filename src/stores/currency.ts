import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Currency } from '@/types/company'
import currencyService from '@/services/currency'

export const useCurrencyStore = defineStore('currency', () => {
  // State
  const currencies = ref<Currency[]>([])
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

  return {
    // State
    currencies,
    loading,
    error,

    // Getters
    activeCurrencies,
    getCurrencyByCode,
    getCurrencyByUuid,
    baseCurrency,

    // Actions
    fetchCurrencies,
    fetchCurrency,
    clearCurrencies
  }
})