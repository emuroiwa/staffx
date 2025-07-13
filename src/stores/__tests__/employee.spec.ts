import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useEmployeeStore } from '@/stores/employee'
import axios from 'axios'

// Mock axios
vi.mock('axios')
const mockedAxios = vi.mocked(axios)

describe('Employee Store', () => {
  let store: ReturnType<typeof useEmployeeStore>

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useEmployeeStore()
    vi.clearAllMocks()
  })

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      expect(store.employees).toEqual([])
      expect(store.positions).toEqual([])
      expect(store.departments).toEqual([])
      expect(store.statistics).toEqual({})
      expect(store.loading).toBe(false)
      expect(store.error).toBeNull()
    })
  })

  describe('Getters', () => {
    beforeEach(() => {
      store.statistics = {
        total_employees: 25,
        active_employees: 20,
        directors: 3,
        total_payroll: 500000
      }
      
      store.employees = [
        { uuid: '1', first_name: 'John', last_name: 'Doe' },
        { uuid: '2', first_name: 'Jane', last_name: 'Smith' }
      ]
    })

    it('should return correct statistics', () => {
      expect(store.totalEmployees).toBe(25)
      expect(store.activeEmployees).toBe(20)
      expect(store.directors).toBe(3)
      expect(store.totalPayroll).toBe(500000)
    })

    it('should return employees by ID', () => {
      const employeesById = store.employeesById
      expect(employeesById['1']).toEqual({ uuid: '1', first_name: 'John', last_name: 'Doe' })
      expect(employeesById['2']).toEqual({ uuid: '2', first_name: 'Jane', last_name: 'Smith' })
    })
  })

  describe('Employee Actions', () => {
    describe('fetchEmployees', () => {
      it('should fetch employees successfully', async () => {
        const mockResponse = {
          data: {
            data: [
              { uuid: '1', first_name: 'John', last_name: 'Doe' },
              { uuid: '2', first_name: 'Jane', last_name: 'Smith' }
            ],
            current_page: 1,
            last_page: 1,
            total: 2
          }
        }
        
        mockedAxios.get.mockResolvedValue(mockResponse)
        
        const result = await store.fetchEmployees({ search: 'test' })
        
        expect(mockedAxios.get).toHaveBeenCalledWith('/api/employees?search=test')
        expect(store.employees).toEqual(mockResponse.data.data)
        expect(result).toEqual(mockResponse.data)
        expect(store.loading).toBe(false)
      })

      it('should handle fetch employees error', async () => {
        const error = new Error('Network error')
        mockedAxios.get.mockRejectedValue(error)
        
        await expect(store.fetchEmployees()).rejects.toThrow('Network error')
        expect(store.error).toBe('Failed to fetch employees')
        expect(store.loading).toBe(false)
      })

      it('should filter out empty parameters', async () => {
        const mockResponse = { data: { data: [] } }
        mockedAxios.get.mockResolvedValue(mockResponse)
        
        await store.fetchEmployees({ 
          search: 'test', 
          department: '', 
          status: null, 
          undefined_param: undefined 
        })
        
        expect(mockedAxios.get).toHaveBeenCalledWith('/api/employees?search=test')
      })
    })

    describe('createEmployee', () => {
      it('should create employee successfully', async () => {
        const newEmployee = { first_name: 'New', last_name: 'Employee' }
        const mockResponse = {
          data: {
            data: { uuid: '123', ...newEmployee }
          }
        }
        
        mockedAxios.post.mockResolvedValue(mockResponse)
        
        const result = await store.createEmployee(newEmployee)
        
        expect(mockedAxios.post).toHaveBeenCalledWith('/api/employees', newEmployee)
        expect(store.employees[0]).toEqual(mockResponse.data.data)
        expect(result).toEqual(mockResponse.data.data)
      })

      it('should handle create employee error', async () => {
        const error = new Error('Validation error')
        mockedAxios.post.mockRejectedValue(error)
        
        await expect(store.createEmployee({})).rejects.toThrow('Validation error')
        expect(store.error).toBe('Failed to create employee')
      })
    })

    describe('updateEmployee', () => {
      beforeEach(() => {
        store.employees = [
          { uuid: '1', first_name: 'John', last_name: 'Doe' },
          { uuid: '2', first_name: 'Jane', last_name: 'Smith' }
        ]
      })

      it('should update employee successfully', async () => {
        const updatedData = { first_name: 'Updated', last_name: 'Name' }
        const mockResponse = {
          data: {
            data: { uuid: '1', ...updatedData }
          }
        }
        
        mockedAxios.put.mockResolvedValue(mockResponse)
        
        const result = await store.updateEmployee('1', updatedData)
        
        expect(mockedAxios.put).toHaveBeenCalledWith('/api/employees/1', updatedData)
        expect(store.employees[0]).toEqual(mockResponse.data.data)
        expect(result).toEqual(mockResponse.data.data)
      })
    })

    describe('deleteEmployee', () => {
      beforeEach(() => {
        store.employees = [
          { uuid: '1', first_name: 'John', last_name: 'Doe' },
          { uuid: '2', first_name: 'Jane', last_name: 'Smith' }
        ]
      })

      it('should delete employee successfully', async () => {
        mockedAxios.delete.mockResolvedValue({})
        
        await store.deleteEmployee('1')
        
        expect(mockedAxios.delete).toHaveBeenCalledWith('/api/employees/1')
        expect(store.employees).toHaveLength(1)
        expect(store.employees[0].uuid).toBe('2')
      })

      it('should handle delete employee error', async () => {
        const error = new Error('Delete error')
        mockedAxios.delete.mockRejectedValue(error)
        
        await expect(store.deleteEmployee('1')).rejects.toThrow('Delete error')
        expect(store.error).toBe('Failed to delete employee')
      })
    })

    describe('exportEmployees', () => {
      it('should export employees successfully', async () => {
        const mockBlob = new Blob(['test data'], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
        const mockResponse = { data: mockBlob }
        
        mockedAxios.get.mockResolvedValue(mockResponse)
        
        // Mock DOM methods and window.URL
        const createElementSpy = vi.spyOn(document, 'createElement')
        const appendChildSpy = vi.spyOn(document.body, 'appendChild')
        const removeChildSpy = vi.spyOn(document.body, 'removeChild')
        
        // Mock window.URL methods (they should be available from vitest.setup.ts)
        const createObjectURLSpy = vi.spyOn(window.URL, 'createObjectURL').mockReturnValue('blob:url')
        const revokeObjectURLSpy = vi.spyOn(window.URL, 'revokeObjectURL').mockImplementation(() => {})
        
        const mockLink = {
          href: '',
          download: '',
          click: vi.fn(),
          setAttribute: vi.fn(),
          remove: vi.fn()
        }
        
        createElementSpy.mockReturnValue(mockLink as any)
        appendChildSpy.mockImplementation(() => {})
        removeChildSpy.mockImplementation(() => {})
        
        await store.exportEmployees({ department: 'engineering' })
        
        expect(mockedAxios.get).toHaveBeenCalledWith('/api/employees/export?department=engineering', {
          responseType: 'blob'
        })
        expect(createElementSpy).toHaveBeenCalledWith('a')
        expect(mockLink.click).toHaveBeenCalled()
        expect(revokeObjectURLSpy).toHaveBeenCalledWith('blob:url')
        
        // Cleanup
        createElementSpy.mockRestore()
        appendChildSpy.mockRestore()
        removeChildSpy.mockRestore()
        createObjectURLSpy.mockRestore()
        revokeObjectURLSpy.mockRestore()
      })
    })

    describe('fetchStatistics', () => {
      it('should fetch statistics successfully', async () => {
        const mockStats = {
          total_employees: 50,
          active_employees: 45,
          directors: 5,
          total_payroll: 1000000
        }
        const mockResponse = { data: { data: mockStats } }
        
        mockedAxios.get.mockResolvedValue(mockResponse)
        
        const result = await store.fetchStatistics()
        
        expect(mockedAxios.get).toHaveBeenCalledWith('/api/employees/statistics')
        expect(store.statistics).toEqual(mockStats)
        expect(result).toEqual(mockStats)
      })
    })
  })

  describe('Position Actions', () => {
    describe('fetchPositions', () => {
      it('should fetch positions successfully', async () => {
        const mockPositions = [
          { id: '1', name: 'Software Engineer' },
          { id: '2', name: 'Designer' }
        ]
        const mockResponse = { data: { data: mockPositions } }
        
        mockedAxios.get.mockResolvedValue(mockResponse)
        
        const result = await store.fetchPositions()
        
        expect(mockedAxios.get).toHaveBeenCalledWith('/api/positions?')
        expect(store.positions).toEqual(mockPositions)
        expect(result).toEqual(mockResponse.data)
      })
    })

    describe('createPosition', () => {
      it('should create position successfully', async () => {
        const newPosition = { name: 'New Position' }
        const mockResponse = {
          data: {
            data: { id: '123', ...newPosition }
          }
        }
        
        mockedAxios.post.mockResolvedValue(mockResponse)
        
        const result = await store.createPosition(newPosition)
        
        expect(mockedAxios.post).toHaveBeenCalledWith('/api/positions', newPosition)
        expect(store.positions[0]).toEqual(mockResponse.data.data)
        expect(result).toEqual(mockResponse.data.data)
      })
    })
  })

  describe('Department Actions', () => {
    describe('fetchDepartments', () => {
      it('should fetch departments successfully', async () => {
        const mockDepartments = [
          { id: '1', name: 'Engineering' },
          { id: '2', name: 'Design' }
        ]
        const mockResponse = { data: { data: mockDepartments } }
        
        mockedAxios.get.mockResolvedValue(mockResponse)
        
        const result = await store.fetchDepartments()
        
        expect(mockedAxios.get).toHaveBeenCalledWith('/api/departments?')
        expect(store.departments).toEqual(mockDepartments)
        expect(result).toEqual(mockResponse.data)
      })
    })

    describe('createDepartment', () => {
      it('should create department successfully', async () => {
        const newDepartment = { name: 'New Department' }
        const mockResponse = {
          data: {
            data: { id: '123', ...newDepartment }
          }
        }
        
        mockedAxios.post.mockResolvedValue(mockResponse)
        
        const result = await store.createDepartment(newDepartment)
        
        expect(mockedAxios.post).toHaveBeenCalledWith('/api/departments', newDepartment)
        expect(store.departments[0]).toEqual(mockResponse.data.data)
        expect(result).toEqual(mockResponse.data.data)
      })
    })
  })

  describe('Utility Actions', () => {
    it('should clear error', () => {
      store.error = 'Some error'
      store.clearError()
      expect(store.error).toBeNull()
    })

    it('should set loading state', () => {
      store.setLoading(true)
      expect(store.loading).toBe(true)
      
      store.setLoading(false)
      expect(store.loading).toBe(false)
    })
  })
})