import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Company, CompanyStats, PaginatedResponse, ApiResponse, User } from '@/types/company'
import api from '@/services/api'

export const useCompanyStore = defineStore('company', () => {
  // State
  const companies = ref<Company[]>([])
  const currentCompany = ref<Company | null>(null)
  const defaultCompany = ref<Company | null>(null)
  const stats = ref<CompanyStats | null>(null)
  const pagination = ref({
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0,
    from: 0,
    to: 0
  })
  const loading = ref(false)
  const statsLoading = ref(false)
  const filters = ref({
    search: '',
    is_active: '',
    per_page: 15
  })

  // Getters
  const companyCount = computed(() => companies.value.length)
  const activeCompanies = computed(() => 
    companies.value.filter(company => company.is_active)
  )
  const hasDefaultCompany = computed(() => !!defaultCompany.value)

  // Actions
  async function fetchCompanies(page = 1, params = {}) {
    loading.value = true
    try {
      const queryParams = {
        page,
        per_page: filters.value.per_page,
        ...filters.value,
        ...params
      }
      
      // Remove empty params
      Object.keys(queryParams).forEach(key => {
        if (queryParams[key] === '' || queryParams[key] === null || queryParams[key] === undefined) {
          delete queryParams[key]
        }
      })

      const response = await api.get('/companies', { params: queryParams })
      
      // Check if response is paginated (HCA) or single company (other roles)
      if (response.data.data.data) {
        // Paginated response for HCA
        const data: PaginatedResponse<Company> = response.data.data
        companies.value = data.data
        pagination.value = {
          current_page: data.current_page,
          last_page: data.last_page,
          per_page: data.per_page,
          total: data.total,
          from: data.from,
          to: data.to
        }
      } else {
        // Single company response for other roles
        companies.value = [response.data.data]
        pagination.value = {
          current_page: 1,
          last_page: 1,
          per_page: 1,
          total: 1,
          from: 1,
          to: 1
        }
      }
      
      return response.data.data
    } catch (error) {
      console.error('Failed to fetch companies:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  async function fetchCompany(id: number) {
    loading.value = true
    try {
      const response = await api.get(`/companies/${id}`)
      currentCompany.value = response.data.data
      return currentCompany.value
    } catch (error) {
      console.error('Failed to fetch company:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  async function createCompany(data: Partial<Company>) {
    loading.value = true
    try {
      const response = await api.post('/companies', data)
      const newCompany: Company = response.data.data
      
      // Add to companies list
      companies.value.unshift(newCompany)
      
      return newCompany
    } catch (error) {
      console.error('Failed to create company:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  async function updateCompany(id: number, data: Partial<Company>) {
    loading.value = true
    try {
      const response = await api.put(`/companies/${id}`, data)
      const updatedCompany: Company = response.data.data
      
      // Update in companies list
      const index = companies.value.findIndex(company => company.id === id)
      if (index !== -1) {
        companies.value[index] = updatedCompany
      }
      
      // Update current company if it's the same one
      if (currentCompany.value?.id === id) {
        currentCompany.value = updatedCompany
      }
      
      // Update default company if it's the same one
      if (defaultCompany.value?.id === id) {
        defaultCompany.value = updatedCompany
      }
      
      return updatedCompany
    } catch (error) {
      console.error('Failed to update company:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  async function deleteCompany(id: number) {
    loading.value = true
    try {
      await api.delete(`/companies/${id}`)
      
      // Remove from companies list
      companies.value = companies.value.filter(company => company.id !== id)
      
      // Clear current company if it's the same one
      if (currentCompany.value?.id === id) {
        currentCompany.value = null
      }
      
      // Clear default company if it's the same one
      if (defaultCompany.value?.id === id) {
        defaultCompany.value = null
      }
      
      return true
    } catch (error) {
      console.error('Failed to delete company:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  async function fetchCompanyStats(id: number) {
    statsLoading.value = true
    try {
      const response = await api.get(`/companies/${id}/stats`)
      stats.value = response.data.data
      return stats.value
    } catch (error) {
      console.error('Failed to fetch company stats:', error)
      throw error
    } finally {
      statsLoading.value = false
    }
  }

  async function fetchDefaultCompany() {
    try {
      const response = await api.get('/companies/default')
      defaultCompany.value = response.data.data.default_company
      return defaultCompany.value
    } catch (error) {
      console.error('Failed to fetch default company:', error)
      throw error
    }
  }

  async function setDefaultCompany(id: number) {
    loading.value = true
    try {
      const response = await api.post(`/companies/${id}/set-default`)
      defaultCompany.value = response.data.data.default_company
      
      return defaultCompany.value
    } catch (error) {
      console.error('Failed to set default company:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  function setFilters(newFilters: Partial<typeof filters.value>) {
    filters.value = { ...filters.value, ...newFilters }
  }

  function clearFilters() {
    filters.value = {
      search: '',
      is_active: '',
      per_page: 15
    }
  }

  function setCurrentCompany(company: Company | null) {
    currentCompany.value = company
  }

  function clearCompanies() {
    companies.value = []
    currentCompany.value = null
    defaultCompany.value = null
    stats.value = null
    pagination.value = {
      current_page: 1,
      last_page: 1,
      per_page: 15,
      total: 0,
      from: 0,
      to: 0
    }
  }

  return {
    // State
    companies,
    currentCompany,
    defaultCompany,
    stats,
    pagination,
    loading,
    statsLoading,
    filters,

    // Getters
    companyCount,
    activeCompanies,
    hasDefaultCompany,

    // Actions
    fetchCompanies,
    fetchCompany,
    createCompany,
    updateCompany,
    deleteCompany,
    fetchCompanyStats,
    fetchDefaultCompany,
    setDefaultCompany,
    setFilters,
    clearFilters,
    setCurrentCompany,
    clearCompanies
  }
})