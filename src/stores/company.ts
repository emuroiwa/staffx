import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Company, CompanyStats, CompanySettings } from '@/types/company'
import api from '@/services/api'

export const useCompanyStore = defineStore('company', () => {
  // State
  const company = ref<Company | null>(null)
  const stats = ref<CompanyStats | null>(null)
  const settings = ref<CompanySettings>({})
  const loading = ref(false)
  const statsLoading = ref(false)

  // Getters
  const companyName = computed(() => company.value?.name || 'Unknown Company')
  const companySlug = computed(() => company.value?.slug || '')
  const hasActiveSubscription = computed(() => company.value?.is_active && 
    (!company.value?.subscription_expires_at || new Date(company.value.subscription_expires_at) > new Date()))
  const isActive = computed(() => company.value?.is_active || false)

  // Actions
  async function fetchCompany() {
    loading.value = true
    try {
      const response = await api.get('/company')
      company.value = response.data.data
      
      // Store company data
      localStorage.setItem('company', JSON.stringify(company.value))
      
      return company.value
    } catch (error) {
      console.error('Failed to fetch company:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  async function updateCompany(data: Partial<Company>) {
    loading.value = true
    try {
      const response = await api.put('/company', data)
      company.value = response.data.data
      
      // Store updated company data
      localStorage.setItem('company', JSON.stringify(company.value))
      
      return company.value
    } catch (error) {
      console.error('Failed to update company:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  async function fetchStats() {
    statsLoading.value = true
    try {
      const response = await api.get('/company/stats')
      stats.value = response.data.data
      return stats.value
    } catch (error) {
      console.error('Failed to fetch company stats:', error)
      throw error
    } finally {
      statsLoading.value = false
    }
  }

  async function fetchSettings() {
    try {
      const response = await api.get('/company/settings')
      settings.value = response.data.data
      return settings.value
    } catch (error) {
      console.error('Failed to fetch company settings:', error)
      throw error
    }
  }

  async function updateSettings(newSettings: Partial<CompanySettings>) {
    try {
      const response = await api.put('/company/settings', { settings: newSettings })
      settings.value = { ...settings.value, ...response.data.data }
      return settings.value
    } catch (error) {
      console.error('Failed to update company settings:', error)
      throw error
    }
  }

  async function uploadLogo(file: File) {
    loading.value = true
    try {
      const formData = new FormData()
      formData.append('logo', file)
      
      const response = await api.post('/company/upload-logo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      
      // Update company logo info
      if (company.value) {
        company.value.logo_path = response.data.data.logo_path
        localStorage.setItem('company', JSON.stringify(company.value))
      }
      
      return response.data.data
    } catch (error) {
      console.error('Failed to upload logo:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  async function removeLogo() {
    loading.value = true
    try {
      await api.delete('/company/logo')
      
      // Update company logo info
      if (company.value) {
        company.value.logo_path = null
        localStorage.setItem('company', JSON.stringify(company.value))
      }
      
      return true
    } catch (error) {
      console.error('Failed to remove logo:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  function initializeCompany() {
    const storedCompany = localStorage.getItem('company')
    if (storedCompany) {
      try {
        company.value = JSON.parse(storedCompany)
      } catch (error) {
        console.error('Failed to parse stored company data:', error)
        localStorage.removeItem('company')
      }
    }
  }

  function clearCompany() {
    company.value = null
    stats.value = null
    settings.value = {}
    localStorage.removeItem('company')
  }

  return {
    // State
    company,
    stats,
    settings,
    loading,
    statsLoading,

    // Getters
    companyName,
    companySlug,
    hasActiveSubscription,
    isActive,

    // Actions
    fetchCompany,
    updateCompany,
    fetchStats,
    fetchSettings,
    updateSettings,
    uploadLogo,
    removeLogo,
    initializeCompany,
    clearCompany
  }
})