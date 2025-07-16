<template>
  <div class="min-h-screen bg-content-light dark:bg-content-dark transition-colors duration-200">
    <!-- Page Header -->
    <div class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Garnishment Management</h1>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage legal deductions and garnishments for all employees</p>
          </div>
          <div class="flex items-center space-x-3">
            <button
              @click="refreshData"
              :disabled="loading"
              class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200"
            >
              <ArrowPathIcon class="w-4 h-4 mr-2" :class="{ 'animate-spin': loading }" />
              Refresh
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
              <ScaleIcon class="h-8 w-8 text-orange-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Total Garnishments</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ statistics.total_garnishments || 0 }}</p>
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
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ statistics.active_garnishments || 0 }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700 transition-colors duration-200">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <HeartIcon class="h-8 w-8 text-red-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Child Support</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ statistics.child_support_count || 0 }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700 transition-colors duration-200">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <CurrencyDollarIcon class="h-8 w-8 text-purple-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Monthly Total</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ formatCurrency(statistics.monthly_total || 0) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters and Search -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6 transition-colors duration-200">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <!-- Search -->
          <div>
            <label for="search" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Search</label>
            <div class="relative">
              <MagnifyingGlassIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                v-model="searchQuery"
                type="text"
                id="search"
                placeholder="Search employees..."
                class="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-red-500 focus:border-red-500 transition-colors duration-200"
              />
            </div>
          </div>

          <!-- Department Filter -->
          <div>
            <label for="department" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Department</label>
            <select
              v-model="filters.department"
              id="department"
              class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-red-500 focus:border-red-500 transition-colors duration-200"
            >
              <option value="">All Departments</option>
              <option v-for="dept in departments" :key="dept.uuid" :value="dept.uuid">
                {{ dept.name }}
              </option>
            </select>
          </div>

          <!-- Status Filter -->
          <div>
            <label for="status" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Employee Status</label>
            <select
              v-model="filters.status"
              id="status"
              class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-red-500 focus:border-red-500 transition-colors duration-200"
            >
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="terminated">Terminated</option>
            </select>
          </div>

          <!-- Garnishment Filter -->
          <div>
            <label for="garnishment" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Garnishments</label>
            <select
              v-model="filters.hasGarnishments"
              id="garnishment"
              class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-red-500 focus:border-red-500 transition-colors duration-200"
            >
              <option value="">All Employees</option>
              <option value="true">With Garnishments</option>
              <option value="false">Without Garnishments</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Employee List -->
      <div class="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-lg font-medium text-gray-900 dark:text-white">Employee Garnishments</h2>
        </div>

        <div v-if="loading" class="p-6">
          <div class="animate-pulse space-y-4">
            <div v-for="i in 5" :key="i" class="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>

        <div v-else-if="filteredEmployees.length === 0" class="p-6 text-center">
          <ScaleIcon class="mx-auto h-12 w-12 text-gray-400" />
          <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">No employees found</h3>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Try adjusting your search criteria or add new employees.
          </p>
        </div>

        <div v-else class="overflow-x-auto">
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
                  Garnishments
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Total Amount
                </th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr
                v-for="employee in filteredEmployees"
                :key="employee.uuid"
                class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <!-- Employee Column -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                      <div class="h-10 w-10 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
                        <span class="text-red-600 dark:text-red-300 font-medium text-sm">
                          {{ getInitials(employee.first_name, employee.last_name) }}
                        </span>
                      </div>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900 dark:text-white">
                        {{ employee.display_name }}
                      </div>
                      <div class="text-sm text-gray-500 dark:text-gray-400">
                        {{ employee.employee_id }}
                      </div>
                    </div>
                  </div>
                </td>
                
                <!-- Position Column -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900 dark:text-white">
                    {{ employee.position?.name || '-' }}
                  </div>
                </td>
                
                <!-- Department Column -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900 dark:text-white">
                    {{ employee.department?.name || '-' }}
                  </div>
                </td>
                
                <!-- Status Column -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    :class="getStatusBadgeClass(employee.status)"
                  >
                    {{ employee.status }}
                  </span>
                </td>
                
                <!-- Garnishments Column -->
                <td class="px-6 py-4 whitespace-nowrap text-center">
                  <div class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                       :class="getGarnishmentBadgeClass(getEmployeeGarnishmentCount(employee.uuid))">
                    {{ getEmployeeGarnishmentCount(employee.uuid) }} 
                    {{ getEmployeeGarnishmentCount(employee.uuid) === 1 ? 'Garnishment' : 'Garnishments' }}
                  </div>
                </td>
                
                <!-- Total Amount Column -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ formatCurrency(getEmployeeGarnishmentTotal(employee.uuid)) }}
                  </div>
                </td>
                
                <!-- Actions Column -->
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    @click="openGarnishmentModal(employee)"
                    class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                  >
                    <ScaleIcon class="w-4 h-4 mr-2" />
                    Manage Garnishments
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div v-if="pagination.total > 0" class="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div class="flex items-center space-x-4">
              <div class="text-sm text-gray-700 dark:text-gray-300">
                Showing {{ pagination.from }} to {{ pagination.to }} of {{ pagination.total }} employees
              </div>
              <div class="flex items-center space-x-2">
                <label for="per-page-garnishment" class="text-sm text-gray-700 dark:text-gray-300">
                  Show:
                </label>
                <select
                  id="per-page-garnishment"
                  v-model="pagination.per_page"
                  @change="changePerPage"
                  class="block px-3 py-1 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md text-sm focus:ring-red-500 focus:border-red-500"
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
            <div v-if="pagination.total > pagination.per_page" class="flex space-x-2">
              <button
                @click="previousPage"
                :disabled="!pagination.prev_page_url"
                class="px-3 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span class="text-sm text-gray-700 dark:text-gray-300 flex items-center px-2">
                Page {{ pagination.current_page }} of {{ Math.ceil(pagination.total / pagination.per_page) }}
              </span>
              <button
                @click="nextPage"
                :disabled="!pagination.next_page_url"
                class="px-3 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Garnishment Management Modal -->
    <GarnishmentManagementModal
      :is-open="garnishmentModalOpen"
      :employee="selectedEmployee"
      @close="closeGarnishmentModal"
      @updated="handleGarnishmentUpdated"
    />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useApi } from '@/composables/useApi'
import { useNotifications } from '@/composables/useNotifications'
import { formatCurrency } from '@/utils/currency'
import {
  ScaleIcon,
  CheckCircleIcon,
  HeartIcon,
  CurrencyDollarIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon
} from '@heroicons/vue/24/outline'
import GarnishmentManagementModal from '@/components/payroll/GarnishmentManagementModal.vue'

const { get } = useApi()
const { showNotification } = useNotifications()

// State
const loading = ref(false)
const employees = ref([])
const departments = ref([])
const employeeGarnishments = ref([])
const selectedEmployee = ref(null)
const garnishmentModalOpen = ref(false)
const statistics = ref({
  total_garnishments: 0,
  active_garnishments: 0,
  child_support_count: 0,
  monthly_total: 0,
  employees_with_garnishments: 0,
  average_garnishment_amount: 0,
  pending_approvals: 0
})

const searchQuery = ref('')
const filters = reactive({
  department: '',
  status: '',
  hasGarnishments: ''
})

const pagination = reactive({
  current_page: 1,
  per_page: 15,
  total: 0,
  from: 0,
  to: 0,
  prev_page_url: null,
  next_page_url: null
})

// Computed
const filteredEmployees = computed(() => {
  let filtered = employees.value

  // Apply client-side garnishment filter only
  if (filters.hasGarnishments) {
    const hasGarnishments = filters.hasGarnishments === 'true'
    filtered = filtered.filter(emp => {
      const garnishmentCount = getEmployeeGarnishmentCount(emp.uuid)
      return hasGarnishments ? garnishmentCount > 0 : garnishmentCount === 0
    })
  }

  return filtered
})

// Methods
const loadEmployees = async () => {
  try {
    loading.value = true
    
    const params = {
      per_page: pagination.per_page,
      page: pagination.current_page,
      include: 'position,department'
    }
    
    if (searchQuery.value) {
      params.search = searchQuery.value
    }
    
    if (filters.department) {
      params.department_uuid = filters.department
    }
    
    if (filters.status) {
      params.status = filters.status
    }
    
    const response = await get('/employees', { params })
    
    employees.value = response.data.data || []
    
    // Update pagination
    const meta = response.data.meta || {}
    const links = response.data.links || {}
    Object.assign(pagination, {
      current_page: meta.current_page || 1,
      per_page: meta.per_page || 15,
      total: meta.total || 0,
      from: meta.from || 0,
      to: meta.to || 0,
      prev_page_url: links.prev || null,
      next_page_url: links.next || null
    })
  } catch (error) {
    showNotification('Error fetching employees', 'error')
    console.error('Error fetching employees:', error)
  } finally {
    loading.value = false
  }
}

const loadDepartments = async () => {
  try {
    const response = await get('/departments')
    departments.value = response.data.data || response.data
  } catch (error) {
    console.error('Failed to load departments:', error)
  }
}

const loadEmployeeGarnishments = async () => {
  try {
    const response = await get('/garnishments', {
      params: {
        per_page: 1000 // Get all garnishments to calculate counts
      }
    })
    employeeGarnishments.value = response.data.data || []
  } catch (error) {
    console.error('Failed to load garnishments:', error)
    employeeGarnishments.value = []
  }
}

const fetchStatistics = async () => {
  try {
    const response = await get('/garnishments/statistics')
    statistics.value = response.data.data || {}
  } catch (error) {
    console.error('Error fetching statistics:', error)
  }
}

const refreshData = async () => {
  await Promise.all([
    loadEmployees(),
    loadDepartments(),
    loadEmployeeGarnishments(),
    fetchStatistics()
  ])
}

const getInitials = (firstName, lastName) => {
  return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase()
}

const getStatusBadgeClass = (status) => {
  const classes = {
    active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    inactive: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    terminated: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
  }
  return classes[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
}

const getEmployeeGarnishmentCount = (employeeUuid) => {
  if (!Array.isArray(employeeGarnishments.value)) {
    return 0
  }
  return employeeGarnishments.value.filter(garnishment => 
    garnishment.employee_uuid === employeeUuid
  ).length
}

const getEmployeeGarnishmentTotal = (employeeUuid) => {
  if (!Array.isArray(employeeGarnishments.value)) {
    return 0
  }
  return employeeGarnishments.value
    .filter(garnishment => 
      garnishment.employee_uuid === employeeUuid && 
      garnishment.status === 'active'
    )
    .reduce((total, garnishment) => {
      return total + (parseFloat(garnishment.amount) || 0)
    }, 0)
}

const getGarnishmentBadgeClass = (count) => {
  if (count === 0) {
    return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
  } else if (count <= 2) {
    return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
  } else {
    return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
  }
}

const openGarnishmentModal = (employee) => {
  selectedEmployee.value = employee
  garnishmentModalOpen.value = true
}

const closeGarnishmentModal = () => {
  garnishmentModalOpen.value = false
  selectedEmployee.value = null
}

const handleGarnishmentUpdated = () => {
  loadEmployeeGarnishments()
  fetchStatistics()
}

const previousPage = () => {
  if (pagination.prev_page_url) {
    pagination.current_page--
    loadEmployees()
  }
}

const nextPage = () => {
  if (pagination.next_page_url) {
    pagination.current_page++
    loadEmployees()
  }
}

const changePerPage = () => {
  pagination.current_page = 1
  loadEmployees()
}

// Watchers
watch([searchQuery, filters], () => {
  pagination.current_page = 1
  loadEmployees()
}, { deep: true })

onMounted(() => {
  refreshData()
})
</script>