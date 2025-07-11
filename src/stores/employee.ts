import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Employee, PaginatedResponse, ApiResponse } from '@/types/company'
import api from '@/services/api'

export const useEmployeeStore = defineStore('employee', () => {
  // State
  const employees = ref<Employee[]>([])
  const currentEmployee = ref<Employee | null>(null)
  const departments = ref<string[]>([])
  const pagination = ref({
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0,
    from: 0,
    to: 0
  })
  const loading = ref(false)
  const filters = ref({
    search: '',
    department: '',
    status: '',
    per_page: 15
  })

  // Getters
  const activeEmployees = computed(() => 
    employees.value.filter(emp => emp.status === 'active')
  )
  const employeeCount = computed(() => employees.value.length)
  const activeEmployeeCount = computed(() => activeEmployees.value.length)

  // Actions
  async function fetchEmployees(page = 1, params = {}) {
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

      const response = await api.get('/employees', { params: queryParams })
      const data: PaginatedResponse<Employee> = response.data.data
      
      employees.value = data.data
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
      console.error('Failed to fetch employees:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  async function fetchEmployee(id: number) {
    loading.value = true
    try {
      const response = await api.get(`/employees/${id}`)
      currentEmployee.value = response.data.data
      return currentEmployee.value
    } catch (error) {
      console.error('Failed to fetch employee:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  async function createEmployee(data: Partial<Employee>) {
    loading.value = true
    try {
      const response = await api.post('/employees', data)
      const newEmployee: Employee = response.data.data
      
      // Add to employees list if it's currently loaded
      employees.value.unshift(newEmployee)
      
      return newEmployee
    } catch (error) {
      console.error('Failed to create employee:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  async function updateEmployee(id: number, data: Partial<Employee>) {
    loading.value = true
    try {
      const response = await api.put(`/employees/${id}`, data)
      const updatedEmployee: Employee = response.data.data
      
      // Update in employees list
      const index = employees.value.findIndex(emp => emp.id === id)
      if (index !== -1) {
        employees.value[index] = updatedEmployee
      }
      
      // Update current employee if it's the same one
      if (currentEmployee.value?.id === id) {
        currentEmployee.value = updatedEmployee
      }
      
      return updatedEmployee
    } catch (error) {
      console.error('Failed to update employee:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  async function deleteEmployee(id: number) {
    loading.value = true
    try {
      await api.delete(`/employees/${id}`)
      
      // Remove from employees list
      employees.value = employees.value.filter(emp => emp.id !== id)
      
      // Clear current employee if it's the same one
      if (currentEmployee.value?.id === id) {
        currentEmployee.value = null
      }
      
      return true
    } catch (error) {
      console.error('Failed to delete employee:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  async function fetchDepartments() {
    try {
      const response = await api.get('/employees/departments')
      departments.value = response.data.data
      return departments.value
    } catch (error) {
      console.error('Failed to fetch departments:', error)
      throw error
    }
  }

  function setFilters(newFilters: Partial<typeof filters.value>) {
    filters.value = { ...filters.value, ...newFilters }
  }

  function clearFilters() {
    filters.value = {
      search: '',
      department: '',
      status: '',
      per_page: 15
    }
  }

  function setCurrentEmployee(employee: Employee | null) {
    currentEmployee.value = employee
  }

  function clearEmployees() {
    employees.value = []
    currentEmployee.value = null
    departments.value = []
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
    employees,
    currentEmployee,
    departments,
    pagination,
    loading,
    filters,

    // Getters
    activeEmployees,
    employeeCount,
    activeEmployeeCount,

    // Actions
    fetchEmployees,
    fetchEmployee,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    fetchDepartments,
    setFilters,
    clearFilters,
    setCurrentEmployee,
    clearEmployees
  }
})