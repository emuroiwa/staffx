<template>
  <div class="min-h-screen bg-content-light dark:bg-content-dark transition-colors duration-200">
    <!-- Page Header -->
    <div class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Employees</h1>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage your organization's employees</p>
          </div>
          <div class="flex items-center space-x-3">
            <!-- Quick Actions -->
            <button
              @click="exportEmployees"
              data-testid="export-btn"
              class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200"
            >
              <ArrowDownTrayIcon class="w-4 h-4 mr-2" />
              Export
            </button>
            <button
              @click="showCreateModal = true"
              data-testid="add-employee-btn"
              class="inline-flex items-center px-4 py-2 bg-blue-600 dark:bg-blue-700 border border-transparent rounded-lg text-sm font-medium text-white hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors duration-200"
            >
              <PlusIcon class="w-4 h-4 mr-2" />
              Add Employee
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Content Area -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Statistics Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700 transition-colors duration-200">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <UsersIcon class="h-8 w-8 text-blue-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Total Employees</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ statistics?.total_employees || 0 }}</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700 transition-colors duration-200">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <CheckCircleIcon class="h-8 w-8 text-green-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Active</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ statistics?.active_employees || 0 }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700 transition-colors duration-200">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <StarIcon class="h-8 w-8 text-yellow-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Directors</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ statistics?.directors || 0 }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700 transition-colors duration-200">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <CurrencyDollarIcon class="h-8 w-8 text-green-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Total Payroll</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ formatCurrency(statistics?.total_payroll || 0) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters and Search -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6 transition-colors duration-200">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <!-- Search -->
          <div class="md:col-span-2">
            <label for="search" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Search</label>
            <div class="relative">
              <MagnifyingGlassIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                v-model="filters.search"
                type="text"
                id="search"
                placeholder="Search employees..."
                class="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                @input="debouncedSearch"
              />
            </div>
          </div>

          <!-- Status Filter -->
          <div>
            <label for="status" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
            <select
              v-model="filters.status"
              id="status"
              class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              @change="fetchEmployees"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="terminated">Terminated</option>
            </select>
          </div>

          <!-- Department Filter -->
          <div>
            <label for="department" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Department</label>
            <select
              v-model="filters.department_uuid"
              id="department"
              class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              @change="fetchEmployees"
            >
              <option value="">All Departments</option>
              <option v-for="dept in departments" :key="dept.id" :value="dept.id">
                {{ dept.name }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <!-- Employee Table -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors duration-200">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">Employee List</h3>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center items-center py-12">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>

        <!-- Employee Table -->
        <div v-else-if="employees && employees.length > 0" class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Employee
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Position
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Department
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Salary
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr 
                v-for="employee in employees" 
                :key="employee.uuid"
                class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                      <div class="h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                        <span class="text-sm font-medium text-gray-700 dark:text-gray-200">
                          {{ getInitials(employee.first_name, employee.last_name) }}
                        </span>
                      </div>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900 dark:text-white">
                        {{ employee.display_name }}
                      </div>
                      <div class="text-sm text-gray-500 dark:text-gray-400">{{ employee.email }}</div>
                      <div class="text-xs text-gray-400 dark:text-gray-500">ID: {{ employee.employee_id }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900 dark:text-white">{{ employee.position?.name || 'N/A' }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900 dark:text-white">{{ employee.department?.name || 'N/A' }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span 
                    class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                    :class="getStatusBadgeClass(employee.status)"
                  >
                    {{ formatStatus(employee.status) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {{ employee.formatted_salary || 'N/A' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex items-center space-x-2">
                    <button
                      @click="viewEmployee(employee)"
                      class="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 transition-colors duration-200"
                    >
                      <EyeIcon class="w-4 h-4" />
                    </button>
                    <button
                      @click="editEmployee(employee)"
                      class="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 transition-colors duration-200"
                    >
                      <PencilIcon class="w-4 h-4" />
                    </button>
                    <button
                      @click="deleteEmployee(employee)"
                      class="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 transition-colors duration-200"
                    >
                      <TrashIcon class="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-12">
          <UsersIcon class="mx-auto h-12 w-12 text-gray-400" />
          <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">No employees found</h3>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Get started by adding a new employee.</p>
          <div class="mt-6">
            <button
              @click="showCreateModal = true"
              class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-800"
            >
              <PlusIcon class="w-4 h-4 mr-2" />
              Add Employee
            </button>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="pagination.total > 0" class="bg-white dark:bg-gray-800 px-6 py-3 border-t border-gray-200 dark:border-gray-700">
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div class="flex items-center space-x-4">
              <div class="text-sm text-gray-700 dark:text-gray-300">
                Showing {{ pagination.from }} to {{ pagination.to }} of {{ pagination.total }} results
              </div>
              <div class="flex items-center space-x-2">
                <label for="per-page" class="text-sm text-gray-700 dark:text-gray-300">
                  Show:
                </label>
                <select
                  id="per-page"
                  v-model="filters.per_page"
                  @change="changePerPage"
                  class="block px-3 py-1 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="10">10</option>
                  <option value="15">15</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
                <span class="text-sm text-gray-700 dark:text-gray-300">per page</span>
              </div>
            </div>
            <div v-if="pagination.last_page > 1" class="flex items-center space-x-2">
              <button
                @click="goToPage(pagination.current_page - 1)"
                :disabled="pagination.current_page <= 1"
                class="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                Previous
              </button>
              <span class="text-sm text-gray-700 dark:text-gray-300">
                Page {{ pagination.current_page }} of {{ pagination.last_page }}
              </span>
              <button
                @click="goToPage(pagination.current_page + 1)"
                :disabled="pagination.current_page >= pagination.last_page"
                class="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create Employee Modal -->
    <EmployeeCreateModal 
      v-if="showCreateModal"
      @close="showCreateModal = false"
      @created="handleEmployeeCreated"
    />

    <!-- Employee Detail Modal -->
    <EmployeeDetailModal
      v-if="selectedEmployee && showDetailModal"
      :employee="selectedEmployee"
      @close="showDetailModal = false"
      @updated="handleEmployeeUpdated"
    />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { debounce } from 'lodash-es'
import { useEmployeeStore } from '@/stores/employee'
import { useNotificationStore } from '@/stores/notification'
import { useCurrency } from '@/composables/useCurrency'
import EmployeeCreateModal from '@/components/employee/EmployeeCreateModal.vue'
import EmployeeDetailModal from '@/components/employee/EmployeeDetailModal.vue'
import {
  UsersIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  ArrowDownTrayIcon,
  CheckCircleIcon,
  StarIcon,
  CurrencyDollarIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/vue/24/outline'

const employeeStore = useEmployeeStore()
const notificationStore = useNotificationStore()
const { formatCurrency } = useCurrency()

// Component state
const loading = ref(false)
const showCreateModal = ref(false)
const showDetailModal = ref(false)
const selectedEmployee = ref(null)

// Data
const employees = ref([])
const departments = ref([])
const statistics = ref({})
const pagination = ref({
  current_page: 1,
  last_page: 1,
  per_page: 15,
  total: 0,
  from: 0,
  to: 0
})

// Filters
const filters = reactive({
  search: '',
  status: '',
  department_uuid: '',
  page: 1,
  per_page: 15
})

// Methods
const fetchEmployees = async () => {
  loading.value = true
  try {
    const response = await employeeStore.fetchEmployees(filters)
    employees.value = response.data
    
    // Laravel ResourceCollection returns pagination data in 'meta' object
    const meta = response.meta || {}
    pagination.value = {
      current_page: meta.current_page || 1,
      last_page: meta.last_page || 1,
      per_page: meta.per_page || 15,
      total: meta.total || 0,
      from: meta.from || 0,
      to: meta.to || 0
    }
  } catch (error) {
    notificationStore.addNotification({
      type: 'error',
      title: 'Error',
      message: 'Failed to fetch employees'
    })
  } finally {
    loading.value = false
  }
}

const fetchStatistics = async () => {
  try {
    statistics.value = await employeeStore.fetchStatistics()
  } catch (error) {
    console.error('Failed to fetch statistics:', error)
  }
}

const fetchDepartments = async () => {
  try {
    const response = await employeeStore.fetchDepartments()
    departments.value = response.data
  } catch (error) {
    console.error('Failed to fetch departments:', error)
  }
}

const debouncedSearch = debounce(() => {
  filters.page = 1
  fetchEmployees()
}, 300)

const goToPage = (page) => {
  if (page >= 1 && page <= pagination.value.last_page) {
    filters.page = page
    fetchEmployees()
  }
}

const changePerPage = () => {
  filters.page = 1  // Reset to first page when changing per-page
  fetchEmployees()
}

const viewEmployee = (employee) => {
  selectedEmployee.value = employee
  showDetailModal.value = true
}

const editEmployee = (employee) => {
  selectedEmployee.value = employee
  showDetailModal.value = true
}

const deleteEmployee = async (employee) => {
  if (confirm(`Are you sure you want to delete ${employee.display_name}?`)) {
    try {
      await employeeStore.deleteEmployee(employee.uuid)
      notificationStore.addNotification({
        type: 'success',
        title: 'Success',
        message: 'Employee deleted successfully'
      })
      fetchEmployees()
      fetchStatistics()
    } catch (error) {
      notificationStore.addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to delete employee'
      })
    }
  }
}

const exportEmployees = async () => {
  try {
    await employeeStore.exportEmployees(filters)
    notificationStore.addNotification({
      type: 'success',
      title: 'Success',
      message: 'Export started. Download will begin shortly.'
    })
  } catch (error) {
    notificationStore.addNotification({
      type: 'error',
      title: 'Error',
      message: 'Failed to export employees'
    })
  }
}

const handleEmployeeCreated = () => {
  showCreateModal.value = false
  fetchEmployees()
  fetchStatistics()
  notificationStore.addNotification({
    type: 'success',
    title: 'Success',
    message: 'Employee created successfully'
  })
}

const handleEmployeeUpdated = () => {
  showDetailModal.value = false
  fetchEmployees()
  fetchStatistics()
  notificationStore.addNotification({
    type: 'success',
    title: 'Success',
    message: 'Employee updated successfully'
  })
}

// Utility functions
const getInitials = (firstName, lastName) => {
  return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase()
}

const getStatusBadgeClass = (status) => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800'
    case 'inactive':
      return 'bg-yellow-100 text-yellow-800'
    case 'terminated':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const formatStatus = (status) => {
  return status.charAt(0).toUpperCase() + status.slice(1)
}


// Lifecycle
onMounted(() => {
  fetchEmployees()
  fetchStatistics()
  fetchDepartments()
})
</script>