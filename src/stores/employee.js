import { defineStore } from 'pinia'
import api from '@/services/api'

export const useEmployeeStore = defineStore('employee', {
  state: () => ({
    employees: [],
    positions: [],
    departments: [],
    statistics: {},
    loading: false,
    error: null
  }),

  getters: {
    totalEmployees: (state) => state.statistics.total_employees || 0,
    activeEmployees: (state) => state.statistics.active_employees || 0,
    directors: (state) => state.statistics.directors || 0,
    totalPayroll: (state) => state.statistics.total_payroll || 0,

    employeesById: (state) => {
      return state.employees.reduce((acc, employee) => {
        acc[employee.uuid] = employee
        return acc
      }, {})
    },

    positionsById: (state) => {
      return state.positions.reduce((acc, position) => {
        acc[position.id] = position
        return acc
      }, {})
    },

    departmentsById: (state) => {
      return state.departments.reduce((acc, department) => {
        acc[department.id] = department
        return acc
      }, {})
    }
  },

  actions: {
    // Employee actions
    async fetchEmployees(filters = {}) {
      this.loading = true
      this.error = null
      
      try {
        const params = new URLSearchParams()
        Object.keys(filters).forEach(key => {
          if (filters[key] !== '' && filters[key] !== null && filters[key] !== undefined) {
            params.append(key, filters[key])
          }
        })

        const response = await api.get(`/employees?${params}`)
        this.employees = response.data.data
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to fetch employees'
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchEmployee(uuid) {
      this.loading = true
      this.error = null
      
      try {
        const response = await api.get(`/employees/${uuid}`)
        return response.data.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to fetch employee'
        throw error
      } finally {
        this.loading = false
      }
    },

    async createEmployee(employeeData) {
      this.loading = true
      this.error = null
      
      try {
        const response = await api.post('/employees', employeeData)
        const newEmployee = response.data.data
        this.employees.unshift(newEmployee)
        return newEmployee
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to create employee'
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateEmployee(uuid, employeeData) {
      this.loading = true
      this.error = null
      
      try {
        const response = await api.put(`/employees/${uuid}`, employeeData)
        const updatedEmployee = response.data.data
        
        const index = this.employees.findIndex(emp => emp.uuid === uuid)
        if (index !== -1) {
          this.employees[index] = updatedEmployee
        }
        
        return updatedEmployee
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to update employee'
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteEmployee(uuid) {
      this.loading = true
      this.error = null
      
      try {
        await api.delete(`/employees/${uuid}`)
        this.employees = this.employees.filter(emp => emp.uuid !== uuid)
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to delete employee'
        throw error
      } finally {
        this.loading = false
      }
    },

    async exportEmployees(filters = {}) {
      this.loading = true
      this.error = null
      
      try {
        const params = new URLSearchParams()
        Object.keys(filters).forEach(key => {
          if (filters[key] !== '' && filters[key] !== null && filters[key] !== undefined) {
            params.append(key, filters[key])
          }
        })

        const response = await api.get(`/employees/export?${params}`, {
          responseType: 'blob'
        })
        
        // Create download link
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', `employees_${new Date().toISOString().split('T')[0]}.xlsx`)
        document.body.appendChild(link)
        link.click()
        link.remove()
        window.URL.revokeObjectURL(url)
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to export employees'
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchStatistics() {
      try {
        const response = await api.get('/employees/statistics')
        this.statistics = response.data.data
        return this.statistics
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to fetch statistics'
        throw error
      }
    },

    async fetchPotentialManagers() {
      try {
        const response = await api.get('/employees/potential-managers')
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to fetch potential managers'
        throw error
      }
    },

    // Position actions
    async fetchPositions(filters = {}) {
      try {
        const params = new URLSearchParams()
        Object.keys(filters).forEach(key => {
          if (filters[key] !== '' && filters[key] !== null && filters[key] !== undefined) {
            params.append(key, filters[key])
          }
        })

        const response = await api.get(`/positions?${params}`)
        this.positions = response.data.data
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to fetch positions'
        throw error
      }
    },

    async fetchPosition(id) {
      try {
        const response = await api.get(`/positions/${id}`)
        return response.data.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to fetch position'
        throw error
      }
    },

    async createPosition(positionData) {
      try {
        const response = await api.post('/positions', positionData)
        const newPosition = response.data.data
        this.positions.unshift(newPosition)
        return newPosition
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to create position'
        throw error
      }
    },

    async updatePosition(id, positionData) {
      try {
        const response = await api.put(`/positions/${id}`, positionData)
        const updatedPosition = response.data.data
        
        const index = this.positions.findIndex(pos => pos.id === id)
        if (index !== -1) {
          this.positions[index] = updatedPosition
        }
        
        return updatedPosition
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to update position'
        throw error
      }
    },

    async deletePosition(id) {
      try {
        await api.delete(`/positions/${id}`)
        this.positions = this.positions.filter(pos => pos.id !== id)
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to delete position'
        throw error
      }
    },

    // Department actions
    async fetchDepartments(filters = {}) {
      try {
        const params = new URLSearchParams()
        Object.keys(filters).forEach(key => {
          if (filters[key] !== '' && filters[key] !== null && filters[key] !== undefined) {
            params.append(key, filters[key])
          }
        })

        const response = await api.get(`/departments?${params}`)
        this.departments = response.data.data
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to fetch departments'
        throw error
      }
    },

    async fetchDepartment(id) {
      try {
        const response = await api.get(`/departments/${id}`)
        return response.data.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to fetch department'
        throw error
      }
    },

    async createDepartment(departmentData) {
      try {
        const response = await api.post('/departments', departmentData)
        const newDepartment = response.data.data
        this.departments.unshift(newDepartment)
        return newDepartment
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to create department'
        throw error
      }
    },

    async updateDepartment(id, departmentData) {
      try {
        const response = await api.put(`/departments/${id}`, departmentData)
        const updatedDepartment = response.data.data
        
        const index = this.departments.findIndex(dept => dept.id === id)
        if (index !== -1) {
          this.departments[index] = updatedDepartment
        }
        
        return updatedDepartment
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to update department'
        throw error
      }
    },

    async deleteDepartment(id) {
      try {
        await api.delete(`/departments/${id}`)
        this.departments = this.departments.filter(dept => dept.id !== id)
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to delete department'
        throw error
      }
    },

    // Utility actions
    clearError() {
      this.error = null
    },

    setLoading(loading) {
      this.loading = loading
    }
  }
})