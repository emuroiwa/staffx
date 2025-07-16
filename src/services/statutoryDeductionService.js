import api from './api'

export const statutoryDeductionService = {
  // Get all company statutory deduction configurations
  async getConfigurations(params = {}) {
    const response = await api.get('/statutory-deduction-configurations', { params })
    return response.data
  },

  // Get available statutory deduction templates for configuration
  async getAvailableTemplates() {
    const response = await api.get('/statutory-deduction-configurations/available-templates')
    return response.data
  },

  // Get a specific configuration
  async getConfiguration(uuid) {
    const response = await api.get(`/statutory-deduction-configurations/${uuid}`)
    return response.data
  },

  // Create a new configuration
  async createConfiguration(data) {
    const response = await api.post('/statutory-deduction-configurations', data)
    return response.data
  },

  // Update an existing configuration
  async updateConfiguration(uuid, data) {
    const response = await api.put(`/statutory-deduction-configurations/${uuid}`, data)
    return response.data
  },

  // Delete a configuration
  async deleteConfiguration(uuid) {
    const response = await api.delete(`/statutory-deduction-configurations/${uuid}`)
    return response.data
  },

  // Toggle configuration active status
  async toggleStatus(uuid) {
    const response = await api.post(`/statutory-deduction-configurations/${uuid}/toggle-status`)
    return response.data
  },

  // Preview calculation for a configuration
  async previewCalculation(uuid, data) {
    const response = await api.post(`/statutory-deduction-configurations/${uuid}/preview-calculation`, data)
    return response.data
  }
}

export default statutoryDeductionService