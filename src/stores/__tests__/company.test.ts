import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useCompanyStore } from '../company'
import api from '../../services/api'

// Mock the api service
vi.mock('../../services/api')

describe('Company Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    // Mock localStorage to prevent token issues
    global.localStorage = {
      getItem: vi.fn(() => 'mock-token'),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
      length: 0,
      key: vi.fn()
    }
  })

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const companyStore = useCompanyStore()

      expect(companyStore.companies).toEqual([])
      expect(companyStore.defaultCompany).toBeNull()
      expect(companyStore.currentCompany).toBeNull()
      expect(companyStore.loading).toBe(false)
      expect(companyStore.pagination).toEqual({
        current_page: 1,
        last_page: 1,
        per_page: 15,
        total: 0,
        from: 0,
        to: 0
      })
      expect(companyStore.filters).toEqual({
        search: '',
        is_active: '',
        per_page: 15
      })
    })
  })

  describe('getters', () => {
    it('should return active companies', () => {
      const companyStore = useCompanyStore()
      
      companyStore.companies = [
        { id: 1, name: 'Active Co', is_active: true },
        { id: 2, name: 'Inactive Co', is_active: false },
        { id: 3, name: 'Another Active Co', is_active: true }
      ]

      expect(companyStore.activeCompanies).toHaveLength(2)
      expect(companyStore.activeCompanies.every(c => c.is_active)).toBe(true)
    })

    it('should return correct company count', () => {
      const companyStore = useCompanyStore()
      
      companyStore.companies = [
        { id: 1, name: 'Company 1' },
        { id: 2, name: 'Company 2' },
        { id: 3, name: 'Company 3' }
      ]

      expect(companyStore.companyCount).toBe(3)
    })

    it('should check if has default company', () => {
      const companyStore = useCompanyStore()
      
      expect(companyStore.hasDefaultCompany).toBe(false)
      
      companyStore.defaultCompany = { id: 1, name: 'Default Company' }
      expect(companyStore.hasDefaultCompany).toBe(true)
    })
  })

  describe('fetchCompanies', () => {
    it('should fetch companies successfully (HCA paginated response)', async () => {
      const companyStore = useCompanyStore()
      const mockResponse = {
        data: {
          success: true,
          data: {
            data: [
              { id: 1, name: 'Company 1', is_active: true },
              { id: 2, name: 'Company 2', is_active: false }
            ],
            current_page: 1,
            last_page: 1,
            per_page: 15,
            total: 2,
            from: 1,
            to: 2
          }
        }
      }

      vi.mocked(api.get).mockResolvedValueOnce(mockResponse)

      await companyStore.fetchCompanies()

      expect(api.get).toHaveBeenCalledWith('/companies', {
        params: {
          page: 1,
          per_page: 15
        }
      })
      expect(companyStore.companies).toEqual(mockResponse.data.data.data)
      expect(companyStore.pagination).toEqual({
        current_page: 1,
        last_page: 1,
        per_page: 15,
        total: 2,
        from: 1,
        to: 2
      })
      expect(companyStore.loading).toBe(false)
    })

    it('should handle single company response (non-HCA)', async () => {
      const companyStore = useCompanyStore()
      const mockResponse = {
        data: {
          success: true,
          data: { id: 1, name: 'Company 1', is_active: true }
        }
      }

      vi.mocked(api.get).mockResolvedValueOnce(mockResponse)

      await companyStore.fetchCompanies()

      expect(companyStore.companies).toEqual([mockResponse.data.data])
      expect(companyStore.pagination).toEqual({
        current_page: 1,
        last_page: 1,
        per_page: 1,
        total: 1,
        from: 1,
        to: 1
      })
    })

    it('should handle fetch companies error', async () => {
      const companyStore = useCompanyStore()
      const mockError = new Error('Network error')

      vi.mocked(api.get).mockRejectedValueOnce(mockError)

      await expect(companyStore.fetchCompanies()).rejects.toThrow('Network error')
      expect(companyStore.loading).toBe(false)
    })
  })

  describe('fetchCompany', () => {
    it('should fetch single company successfully', async () => {
      const companyStore = useCompanyStore()
      const mockResponse = {
        data: {
          success: true,
          data: { id: 1, name: 'Company 1', is_active: true }
        }
      }

      vi.mocked(api.get).mockResolvedValueOnce(mockResponse)

      const result = await companyStore.fetchCompany(1)

      expect(api.get).toHaveBeenCalledWith('/companies/1')
      expect(companyStore.currentCompany).toEqual(mockResponse.data.data)
      expect(result).toEqual(mockResponse.data.data)
    })
  })

  describe('createCompany', () => {
    it('should create company successfully', async () => {
      const companyStore = useCompanyStore()
      const newCompany = { name: 'New Company', email: 'test@example.com' }
      const mockResponse = {
        data: {
          success: true,
          data: { id: 1, name: 'New Company', email: 'test@example.com', is_active: true }
        }
      }

      vi.mocked(api.post).mockResolvedValueOnce(mockResponse)

      const result = await companyStore.createCompany(newCompany)

      expect(api.post).toHaveBeenCalledWith('/companies', newCompany)
      expect(companyStore.companies[0]).toEqual(mockResponse.data.data)
      expect(result).toEqual(mockResponse.data.data)
    })

    it('should handle create company error', async () => {
      const companyStore = useCompanyStore()
      const newCompany = { name: 'New Company' }
      const mockError = new Error('Validation error')

      vi.mocked(api.post).mockRejectedValueOnce(mockError)

      await expect(companyStore.createCompany(newCompany)).rejects.toThrow('Validation error')
    })
  })

  describe('updateCompany', () => {
    it('should update company successfully', async () => {
      const companyStore = useCompanyStore()
      const existingCompany = { id: 1, name: 'Old Name', email: 'old@example.com' }
      const updates = { name: 'New Name', email: 'new@example.com' }
      const mockResponse = {
        data: {
          success: true,
          data: { id: 1, name: 'New Name', email: 'new@example.com' }
        }
      }

      companyStore.companies = [existingCompany]
      vi.mocked(api.put).mockResolvedValueOnce(mockResponse)

      const result = await companyStore.updateCompany(1, updates)

      expect(api.put).toHaveBeenCalledWith('/companies/1', updates)
      expect(companyStore.companies[0]).toEqual(mockResponse.data.data)
      expect(result).toEqual(mockResponse.data.data)
    })

    it('should update current and default company if same id', async () => {
      const companyStore = useCompanyStore()
      const company = { id: 1, name: 'Old Name' }
      const mockResponse = {
        data: {
          success: true,
          data: { id: 1, name: 'New Name' }
        }
      }

      companyStore.companies = [company]
      companyStore.currentCompany = company
      companyStore.defaultCompany = company
      vi.mocked(api.put).mockResolvedValueOnce(mockResponse)

      await companyStore.updateCompany(1, { name: 'New Name' })

      expect(companyStore.currentCompany).toEqual(mockResponse.data.data)
      expect(companyStore.defaultCompany).toEqual(mockResponse.data.data)
    })
  })

  describe('deleteCompany', () => {
    it('should delete company successfully', async () => {
      const companyStore = useCompanyStore()
      const company1 = { id: 1, name: 'Company 1' }
      const company2 = { id: 2, name: 'Company 2' }
      
      companyStore.companies = [company1, company2]
      companyStore.defaultCompany = company1
      companyStore.currentCompany = company1

      vi.mocked(api.delete).mockResolvedValueOnce({ data: { success: true } })

      const result = await companyStore.deleteCompany(1)

      expect(api.delete).toHaveBeenCalledWith('/companies/1')
      expect(companyStore.companies).toHaveLength(1)
      expect(companyStore.companies[0]).toEqual(company2)
      expect(companyStore.defaultCompany).toBeNull()
      expect(companyStore.currentCompany).toBeNull()
      expect(result).toBe(true)
    })
  })

  describe('setDefaultCompany', () => {
    it('should set default company successfully', async () => {
      const companyStore = useCompanyStore()
      const company = { id: 1, name: 'Default Company' }
      const mockResponse = {
        data: {
          success: true,
          data: { default_company: company }
        }
      }

      vi.mocked(api.post).mockResolvedValueOnce(mockResponse)

      const result = await companyStore.setDefaultCompany(1)

      expect(api.post).toHaveBeenCalledWith('/companies/1/set-default')
      expect(companyStore.defaultCompany).toEqual(company)
      expect(result).toEqual(company)
    })
  })

  describe('fetchDefaultCompany', () => {
    it('should fetch default company successfully', async () => {
      const companyStore = useCompanyStore()
      const defaultCompany = { id: 1, name: 'Default Company' }
      const mockResponse = {
        data: {
          success: true,
          data: { default_company: defaultCompany }
        }
      }

      vi.mocked(api.get).mockResolvedValueOnce(mockResponse)

      const result = await companyStore.fetchDefaultCompany()

      expect(api.get).toHaveBeenCalledWith('/companies/default')
      expect(companyStore.defaultCompany).toEqual(defaultCompany)
      expect(result).toEqual(defaultCompany)
    })
  })

  describe('setFilters', () => {
    it('should update filters', () => {
      const companyStore = useCompanyStore()

      companyStore.setFilters({ search: 'test', is_active: 'true' })

      expect(companyStore.filters.search).toBe('test')
      expect(companyStore.filters.is_active).toBe('true')
      expect(companyStore.filters.per_page).toBe(15) // Should keep existing value
    })
  })

  describe('clearFilters', () => {
    it('should reset filters to defaults', () => {
      const companyStore = useCompanyStore()
      
      companyStore.filters = { search: 'test', is_active: 'true', per_page: 10 }
      companyStore.clearFilters()

      expect(companyStore.filters).toEqual({
        search: '',
        is_active: '',
        per_page: 15
      })
    })
  })

  describe('setCurrentCompany', () => {
    it('should set current company', () => {
      const companyStore = useCompanyStore()
      const company = { id: 1, name: 'Current Company' }

      companyStore.setCurrentCompany(company)

      expect(companyStore.currentCompany).toEqual(company)
    })

    it('should clear current company when null', () => {
      const companyStore = useCompanyStore()
      
      companyStore.currentCompany = { id: 1, name: 'Company' }
      companyStore.setCurrentCompany(null)

      expect(companyStore.currentCompany).toBeNull()
    })
  })

  describe('clearCompanies', () => {
    it('should clear all company data', () => {
      const companyStore = useCompanyStore()
      
      companyStore.companies = [{ id: 1, name: 'Company 1' }]
      companyStore.defaultCompany = { id: 1, name: 'Company 1' }
      companyStore.currentCompany = { id: 1, name: 'Company 1' }
      companyStore.pagination.total = 10

      companyStore.clearCompanies()

      expect(companyStore.companies).toEqual([])
      expect(companyStore.defaultCompany).toBeNull()
      expect(companyStore.currentCompany).toBeNull()
      expect(companyStore.stats).toBeNull()
      expect(companyStore.pagination).toEqual({
        current_page: 1,
        last_page: 1,
        per_page: 15,
        total: 0,
        from: 0,
        to: 0
      })
    })
  })

  describe('fetchCompanyStats', () => {
    it('should fetch company stats successfully', async () => {
      const companyStore = useCompanyStore()
      const mockStats = {
        employees_count: 25,
        active_employees: 20,
        departments_count: 5
      }
      const mockResponse = {
        data: {
          success: true,
          data: mockStats
        }
      }

      vi.mocked(api.get).mockResolvedValueOnce(mockResponse)

      const result = await companyStore.fetchCompanyStats(1)

      expect(api.get).toHaveBeenCalledWith('/companies/1/stats')
      expect(companyStore.stats).toEqual(mockStats)
      expect(result).toEqual(mockStats)
      expect(companyStore.statsLoading).toBe(false)
    })
  })
})