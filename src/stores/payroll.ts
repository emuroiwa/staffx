import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Payroll, PaginatedResponse, ApiResponse } from '@/types/company'
import api from '@/services/api'

export const usePayrollStore = defineStore('payroll', () => {
  // State
  const payrolls = ref<Payroll[]>([])
  const currentPayroll = ref<Payroll | null>(null)
  const summary = ref<any>(null)
  const pagination = ref({
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0,
    from: 0,
    to: 0
  })
  const loading = ref(false)
  const summaryLoading = ref(false)
  const filters = ref({
    employee_id: '',
    pay_period_start: '',
    pay_period_end: '',
    status: '',
    per_page: 15
  })

  // Getters
  const draftPayrolls = computed(() => 
    payrolls.value.filter(payroll => payroll.status === 'draft')
  )
  const processedPayrolls = computed(() => 
    payrolls.value.filter(payroll => payroll.status === 'processed')
  )
  const paidPayrolls = computed(() => 
    payrolls.value.filter(payroll => payroll.status === 'paid')
  )
  const totalGrossPay = computed(() => 
    payrolls.value.reduce((sum, payroll) => sum + payroll.gross_pay, 0)
  )
  const totalNetPay = computed(() => 
    payrolls.value.reduce((sum, payroll) => sum + payroll.net_pay, 0)
  )

  // Actions
  async function fetchPayrolls(page = 1, params = {}) {
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

      const response = await api.get('/payrolls', { params: queryParams })
      const data: PaginatedResponse<Payroll> = response.data.data
      
      payrolls.value = data.data
      pagination.value = {
        current_page: data.current_page,
        last_page: data.last_page,
        per_page: data.per_page,
        total: data.total,
        from: data.from,
        to: data.to
      }
      
      return data
    } catch (error) {
      console.error('Failed to fetch payrolls:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  async function fetchPayroll(id: number) {
    loading.value = true
    try {
      const response = await api.get(`/payrolls/${id}`)
      currentPayroll.value = response.data.data
      return currentPayroll.value
    } catch (error) {
      console.error('Failed to fetch payroll:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  async function createPayroll(data: Partial<Payroll>) {
    loading.value = true
    try {
      const response = await api.post('/payrolls', data)
      const newPayroll: Payroll = response.data.data
      
      // Add to payrolls list if it's currently loaded
      payrolls.value.unshift(newPayroll)
      
      return newPayroll
    } catch (error) {
      console.error('Failed to create payroll:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  async function updatePayroll(id: number, data: Partial<Payroll>) {
    loading.value = true
    try {
      const response = await api.put(`/payrolls/${id}`, data)
      const updatedPayroll: Payroll = response.data.data
      
      // Update in payrolls list
      const index = payrolls.value.findIndex(payroll => payroll.id === id)
      if (index !== -1) {
        payrolls.value[index] = updatedPayroll
      }
      
      // Update current payroll if it's the same one
      if (currentPayroll.value?.id === id) {
        currentPayroll.value = updatedPayroll
      }
      
      return updatedPayroll
    } catch (error) {
      console.error('Failed to update payroll:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  async function deletePayroll(id: number) {
    loading.value = true
    try {
      await api.delete(`/payrolls/${id}`)
      
      // Remove from payrolls list
      payrolls.value = payrolls.value.filter(payroll => payroll.id !== id)
      
      // Clear current payroll if it's the same one
      if (currentPayroll.value?.id === id) {
        currentPayroll.value = null
      }
      
      return true
    } catch (error) {
      console.error('Failed to delete payroll:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  async function fetchSummary(params = {}) {
    summaryLoading.value = true
    try {
      const response = await api.get('/payrolls/summary', { params })
      summary.value = response.data.data
      return summary.value
    } catch (error) {
      console.error('Failed to fetch payroll summary:', error)
      throw error
    } finally {
      summaryLoading.value = false
    }
  }

  function setFilters(newFilters: Partial<typeof filters.value>) {
    filters.value = { ...filters.value, ...newFilters }
  }

  function clearFilters() {
    filters.value = {
      employee_id: '',
      pay_period_start: '',
      pay_period_end: '',
      status: '',
      per_page: 15
    }
  }

  function setCurrentPayroll(payroll: Payroll | null) {
    currentPayroll.value = payroll
  }

  function clearPayrolls() {
    payrolls.value = []
    currentPayroll.value = null
    summary.value = null
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
    payrolls,
    currentPayroll,
    summary,
    pagination,
    loading,
    summaryLoading,
    filters,

    // Getters
    draftPayrolls,
    processedPayrolls,
    paidPayrolls,
    totalGrossPay,
    totalNetPay,

    // Actions
    fetchPayrolls,
    fetchPayroll,
    createPayroll,
    updatePayroll,
    deletePayroll,
    fetchSummary,
    setFilters,
    clearFilters,
    setCurrentPayroll,
    clearPayrolls
  }
})