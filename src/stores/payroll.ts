import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Payroll, PaginatedResponse, ApiResponse, PayrollCalculationDetails, Employee, WorkHours, OvertimeRequest } from '@/types/company'
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
    employee_uuid: '',
    pay_period_start: '',
    pay_period_end: '',
    status: '',
    employment_type: '',
    per_page: 15
  })
  
  // New state for enhanced payroll features
  const calculationDetails = ref<PayrollCalculationDetails | null>(null)
  const workHours = ref<WorkHours[]>([])
  const overtimeRequests = ref<OvertimeRequest[]>([])
  const payrollCalculationLoading = ref(false)
  const workHoursLoading = ref(false)

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
  
  // New getters for enhanced payroll features
  const hourlyEmployeePayrolls = computed(() => 
    payrolls.value.filter(payroll => payroll.employment_type === 'hourly')
  )
  const salariedEmployeePayrolls = computed(() => 
    payrolls.value.filter(payroll => payroll.employment_type === 'salaried')
  )
  const totalOvertimeHours = computed(() => 
    payrolls.value.reduce((sum, payroll) => sum + (payroll.overtime_hours || 0), 0)
  )
  const totalOvertimePay = computed(() => 
    payrolls.value.reduce((sum, payroll) => sum + (payroll.overtime_pay || 0), 0)
  )
  const approvedPayrolls = computed(() => 
    payrolls.value.filter(payroll => payroll.status === 'approved')
  )
  const pendingOvertimeRequests = computed(() => 
    overtimeRequests.value.filter(request => request.status === 'pending')
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
      employee_uuid: '',
      pay_period_start: '',
      pay_period_end: '',
      status: '',
      employment_type: '',
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
    calculationDetails.value = null
    workHours.value = []
    overtimeRequests.value = []
    pagination.value = {
      current_page: 1,
      last_page: 1,
      per_page: 15,
      total: 0,
      from: 0,
      to: 0
    }
  }

  // New enhanced payroll calculation actions
  async function calculateEmployeePayroll(employeeUuid: string, payrollPeriodStart: string, payrollPeriodEnd: string, options = {}) {
    payrollCalculationLoading.value = true
    try {
      const response = await api.post('/payroll/calculate-employee', {
        employee_uuid: employeeUuid,
        payroll_period_start: payrollPeriodStart,
        payroll_period_end: payrollPeriodEnd,
        ...options
      })
      calculationDetails.value = response.data.data.calculation_details
      return response.data.data
    } catch (error) {
      console.error('Failed to calculate employee payroll:', error)
      throw error
    } finally {
      payrollCalculationLoading.value = false
    }
  }

  async function calculateBatchPayroll(employeeUuids: string[], payrollPeriodStart: string, payrollPeriodEnd: string, options = {}) {
    payrollCalculationLoading.value = true
    try {
      const response = await api.post('/payroll/calculate-batch', {
        employee_uuids: employeeUuids,
        payroll_period_start: payrollPeriodStart,
        payroll_period_end: payrollPeriodEnd,
        ...options
      })
      return response.data.data
    } catch (error) {
      console.error('Failed to calculate batch payroll:', error)
      throw error
    } finally {
      payrollCalculationLoading.value = false
    }
  }

  async function fetchWorkHours(employeeUuid: string, startDate: string, endDate: string) {
    workHoursLoading.value = true
    try {
      const response = await api.get('/work-hours', {
        params: {
          employee_uuid: employeeUuid,
          start_date: startDate,
          end_date: endDate
        }
      })
      workHours.value = response.data.data
      return workHours.value
    } catch (error) {
      console.error('Failed to fetch work hours:', error)
      throw error
    } finally {
      workHoursLoading.value = false
    }
  }

  async function submitWorkHours(workHoursData: Partial<WorkHours>) {
    try {
      const response = await api.post('/work-hours', workHoursData)
      const newWorkHours = response.data.data
      workHours.value.push(newWorkHours)
      return newWorkHours
    } catch (error) {
      console.error('Failed to submit work hours:', error)
      throw error
    }
  }

  async function updateWorkHours(id: string, workHoursData: Partial<WorkHours>) {
    try {
      const response = await api.put(`/work-hours/${id}`, workHoursData)
      const updatedWorkHours = response.data.data
      const index = workHours.value.findIndex(wh => wh.uuid === id)
      if (index !== -1) {
        workHours.value[index] = updatedWorkHours
      }
      return updatedWorkHours
    } catch (error) {
      console.error('Failed to update work hours:', error)
      throw error
    }
  }

  async function approveWorkHours(id: string) {
    try {
      const response = await api.put(`/work-hours/${id}/approve`)
      const updatedWorkHours = response.data.data
      const index = workHours.value.findIndex(wh => wh.uuid === id)
      if (index !== -1) {
        workHours.value[index] = updatedWorkHours
      }
      return updatedWorkHours
    } catch (error) {
      console.error('Failed to approve work hours:', error)
      throw error
    }
  }

  async function fetchOvertimeRequests(employeeUuid?: string) {
    try {
      const params = employeeUuid ? { employee_uuid: employeeUuid } : {}
      const response = await api.get('/overtime-requests', { params })
      overtimeRequests.value = response.data.data
      return overtimeRequests.value
    } catch (error) {
      console.error('Failed to fetch overtime requests:', error)
      throw error
    }
  }

  async function submitOvertimeRequest(overtimeData: Partial<OvertimeRequest>) {
    try {
      const response = await api.post('/overtime-requests', overtimeData)
      const newRequest = response.data.data
      overtimeRequests.value.push(newRequest)
      return newRequest
    } catch (error) {
      console.error('Failed to submit overtime request:', error)
      throw error
    }
  }

  async function approveOvertimeRequest(id: string, approved: boolean, notes?: string) {
    try {
      const response = await api.put(`/overtime-requests/${id}/review`, {
        status: approved ? 'approved' : 'rejected',
        notes
      })
      const updatedRequest = response.data.data
      const index = overtimeRequests.value.findIndex(req => req.uuid === id)
      if (index !== -1) {
        overtimeRequests.value[index] = updatedRequest
      }
      return updatedRequest
    } catch (error) {
      console.error('Failed to review overtime request:', error)
      throw error
    }
  }

  async function approvePayroll(id: string | number, approvedBy: string) {
    loading.value = true
    try {
      const response = await api.put(`/payrolls/${id}/approve`, { approved_by: approvedBy })
      const updatedPayroll = response.data.data
      
      const index = payrolls.value.findIndex(payroll => 
        payroll.id === id || payroll.uuid === id
      )
      if (index !== -1) {
        payrolls.value[index] = updatedPayroll
      }
      
      if (currentPayroll.value?.id === id || currentPayroll.value?.uuid === id) {
        currentPayroll.value = updatedPayroll
      }
      
      return updatedPayroll
    } catch (error) {
      console.error('Failed to approve payroll:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  async function processPayroll(id: string | number) {
    loading.value = true
    try {
      const response = await api.put(`/payrolls/${id}/process`)
      const updatedPayroll = response.data.data
      
      const index = payrolls.value.findIndex(payroll => 
        payroll.id === id || payroll.uuid === id
      )
      if (index !== -1) {
        payrolls.value[index] = updatedPayroll
      }
      
      if (currentPayroll.value?.id === id || currentPayroll.value?.uuid === id) {
        currentPayroll.value = updatedPayroll
      }
      
      return updatedPayroll
    } catch (error) {
      console.error('Failed to process payroll:', error)
      throw error
    } finally {
      loading.value = false
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
    calculationDetails,
    workHours,
    overtimeRequests,
    payrollCalculationLoading,
    workHoursLoading,

    // Getters
    draftPayrolls,
    processedPayrolls,
    paidPayrolls,
    totalGrossPay,
    totalNetPay,
    hourlyEmployeePayrolls,
    salariedEmployeePayrolls,
    totalOvertimeHours,
    totalOvertimePay,
    approvedPayrolls,
    pendingOvertimeRequests,

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
    clearPayrolls,
    
    // Enhanced payroll calculation actions
    calculateEmployeePayroll,
    calculateBatchPayroll,
    fetchWorkHours,
    submitWorkHours,
    updateWorkHours,
    approveWorkHours,
    fetchOvertimeRequests,
    submitOvertimeRequest,
    approveOvertimeRequest,
    approvePayroll,
    processPayroll
  }
})