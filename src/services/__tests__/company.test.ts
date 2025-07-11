import { describe, it, expect, vi, beforeEach } from 'vitest'
import companyService from '../company'
import api from '../api'

// Mock the api module
vi.mock('../api')

describe('CompanyService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getCompanies', () => {
    it('should fetch companies with default params', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: {
            data: [
              { id: 1, name: 'Company 1', is_active: true },
              { id: 2, name: 'Company 2', is_active: false }
            ],
            current_page: 1,
            per_page: 12,
            total: 2,
            last_page: 1
          }
        }
      }

      vi.mocked(api.get).mockResolvedValueOnce(mockResponse)

      const result = await companyService.getCompanies()

      expect(api.get).toHaveBeenCalledWith('/companies', { params: {} })
      expect(result).toEqual(mockResponse.data)
    })

    it('should fetch companies with filters', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: {
            data: [{ id: 1, name: 'Active Company', is_active: true }],
            current_page: 1,
            per_page: 10,
            total: 1,
            last_page: 1
          }
        }
      }

      vi.mocked(api.get).mockResolvedValueOnce(mockResponse)

      const params = {
        page: 1,
        per_page: 10,
        search: 'Active',
        status: 'active' as const,
        subscription_status: 'all' as const
      }

      const result = await companyService.getCompanies(params)

      expect(api.get).toHaveBeenCalledWith('/companies', { params })
      expect(result).toEqual(mockResponse.data)
    })
  })

  describe('getCompany', () => {
    it('should fetch single company by id', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: { id: 1, name: 'Company 1', is_active: true }
        }
      }

      vi.mocked(api.get).mockResolvedValueOnce(mockResponse)

      const result = await companyService.getCompany(1)

      expect(api.get).toHaveBeenCalledWith('/companies/1')
      expect(result).toEqual(mockResponse.data)
    })
  })

  describe('createCompany', () => {
    it('should create new company', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: {
            id: 1,
            name: 'New Company',
            email: 'test@company.com',
            is_active: true
          }
        }
      }

      vi.mocked(api.post).mockResolvedValueOnce(mockResponse)

      const companyData = {
        name: 'New Company',
        email: 'test@company.com',
        is_active: true
      }

      const result = await companyService.createCompany(companyData)

      expect(api.post).toHaveBeenCalledWith('/companies', companyData)
      expect(result).toEqual(mockResponse.data)
    })
  })

  describe('updateCompany', () => {
    it('should update existing company', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: {
            id: 1,
            name: 'Updated Company',
            email: 'updated@company.com',
            is_active: true
          }
        }
      }

      vi.mocked(api.put).mockResolvedValueOnce(mockResponse)

      const updateData = {
        name: 'Updated Company',
        email: 'updated@company.com'
      }

      const result = await companyService.updateCompany(1, updateData)

      expect(api.put).toHaveBeenCalledWith('/companies/1', updateData)
      expect(result).toEqual(mockResponse.data)
    })
  })

  describe('deleteCompany', () => {
    it('should delete company by id', async () => {
      const mockResponse = {
        data: {
          success: true,
          message: 'Company deleted successfully'
        }
      }

      vi.mocked(api.delete).mockResolvedValueOnce(mockResponse)

      const result = await companyService.deleteCompany(1)

      expect(api.delete).toHaveBeenCalledWith('/companies/1')
      expect(result).toEqual(mockResponse.data)
    })
  })

  describe('setDefaultCompany', () => {
    it('should set default company', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: {
            user: {
              id: 1,
              default_company_id: 5
            }
          }
        }
      }

      vi.mocked(api.post).mockResolvedValueOnce(mockResponse)

      const result = await companyService.setDefaultCompany(5)

      expect(api.post).toHaveBeenCalledWith('/companies/set-default', { company_id: 5 })
      expect(result).toEqual(mockResponse.data)
    })
  })

  describe('getDefaultCompany', () => {
    it('should fetch default company', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: {
            id: 1,
            name: 'Default Company',
            is_active: true
          }
        }
      }

      vi.mocked(api.get).mockResolvedValueOnce(mockResponse)

      const result = await companyService.getDefaultCompany()

      expect(api.get).toHaveBeenCalledWith('/companies/default')
      expect(result).toEqual(mockResponse.data)
    })
  })

  describe('error handling', () => {
    it('should handle API errors', async () => {
      const mockError = {
        response: {
          data: {
            success: false,
            message: 'Server error'
          },
          status: 500
        }
      }

      vi.mocked(api.get).mockRejectedValueOnce(mockError)

      await expect(companyService.getCompanies()).rejects.toEqual(mockError)
    })
  })
})