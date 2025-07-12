import api from './api'
import type { Company } from '@/types/company'

export interface CompanyFilters {
  search?: string
  status?: 'all' | 'active' | 'inactive'
  subscription_status?: 'all' | 'active' | 'expired'
}

export interface CompanyListParams extends CompanyFilters {
  page?: number
  per_page?: number
}

export interface PaginatedResponse<T> {
  data: T[]
  current_page: number
  per_page: number
  total: number
  last_page: number
}

class CompanyService {
  async getCompanies(params: CompanyListParams = {}) {
    const response = await api.get('/companies', { params })
    return response.data
  }

  async getCompany(id: number | string) {
    const response = await api.get(`/companies/${id}`)
    return response.data
  }

  async createCompany(data: Partial<Company>) {
    const response = await api.post('/companies', data)
    return response.data
  }

  async updateCompany(id: number | string, data: Partial<Company>) {
    const response = await api.put(`/companies/${id}`, data)
    return response.data
  }

  async deleteCompany(id: number | string) {
    const response = await api.delete(`/companies/${id}`)
    return response.data
  }

  async setDefaultCompany(companyId: number | string) {
    const response = await api.post('/companies/set-default', { 
      company_id: companyId,
      company_uuid: typeof companyId === 'string' ? companyId : undefined 
    })
    return response.data
  }

  async getDefaultCompany() {
    const response = await api.get('/companies/default')
    return response.data
  }
}

export default new CompanyService()