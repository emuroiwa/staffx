import api from './api'

export const payslipApi = {
  // Get payslip finalization status for a specific pay frequency
  getFinalizationStatus: async (payFrequency) => {
    const response = await api.get('/payslips/finalization-status', {
      params: { pay_frequency: payFrequency }
    })
    return response.data
  },

  // Get finalization preview for multiple payrolls
  getFinalizationPreview: async (payrollUuids) => {
    const response = await api.post('/payslips/finalization-preview', {
      payroll_uuids: payrollUuids
    })
    return response.data
  },

  // Bulk finalize multiple payslips
  bulkFinalize: async (payrollUuids) => {
    const response = await api.post('/payslips/bulk-finalize', {
      payroll_uuids: payrollUuids
    })
    return response.data
  },

  // Finalize a single payslip
  finalize: async (payrollUuid) => {
    const response = await api.post(`/payslips/${payrollUuid}/finalize`)
    return response.data
  },

  // Set payslip status to in progress
  setInProgress: async (payrollUuid) => {
    const response = await api.post(`/payslips/${payrollUuid}/set-in-progress`)
    return response.data
  },

  // Get payslips list with filters
  getPayslips: async (params = {}) => {
    const response = await api.get('/payslips', { params })
    return response.data
  },

  // Get specific payslip details
  getPayslip: async (payslipUuid) => {
    const response = await api.get(`/payslips/${payslipUuid}`)
    return response.data
  },

  // Delete payslip
  deletePayslip: async (payslipUuid) => {
    const response = await api.delete(`/payslips/${payslipUuid}`)
    return response.data
  },

  // Get payrolls by employee UUIDs
  getPayrollsByEmployees: async (employeeUuids) => {
    const response = await api.get('/payrolls', {
      params: { 
        employee_uuids: employeeUuids.join(','),
        payslip_status: 'draft,in_progress,pending_approval,approved' // Exclude finalized
      }
    })
    return response.data
  }
}

export const payRunApi = {
  // Validate pay run creation
  validateCreation: async (payFrequencies) => {
    const response = await api.post('/pay-runs/validate-creation', {
      pay_frequencies: payFrequencies
    })
    return response.data
  },

  // Get pay runs list
  getPayRuns: async (params = {}) => {
    const response = await api.get('/pay-runs', { params })
    return response.data
  },

  // Create pay run
  createPayRun: async (data) => {
    const response = await api.post('/pay-runs', data)
    return response.data
  },

  // Get pay run details
  getPayRun: async (payRunUuid) => {
    const response = await api.get(`/pay-runs/${payRunUuid}`)
    return response.data
  }
}

export default {
  payslip: payslipApi,
  payRun: payRunApi
}