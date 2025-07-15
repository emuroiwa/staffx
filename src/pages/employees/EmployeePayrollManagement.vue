<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="bg-white dark:bg-gray-800 shadow rounded-lg">
      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Employee Payroll Management</h1>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Manage payroll items and construct payslips for your employees
            </p>
          </div>
          <div class="flex space-x-3">
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

      <!-- Filters -->
      <div class="px-6 py-4 bg-gray-50 dark:bg-gray-700">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Search</label>
            <div class="relative">
              <MagnifyingGlassIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                v-model="filters.search"
                type="text"
                placeholder="Search employees..."
                class="pl-10 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:placeholder-gray-400 transition-colors duration-200 text-sm"
              >
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Department</label>
            <select
              v-model="filters.department"
              class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:placeholder-gray-400 transition-colors duration-200 text-sm"
            >
              <option value="">All Departments</option>
              <option v-for="dept in departments" :key="dept.uuid" :value="dept.uuid">
                {{ dept.name }}
              </option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
            <select
              v-model="filters.status"
              class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:placeholder-gray-400 transition-colors duration-200 text-sm"
            >
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="terminated">Terminated</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Payroll Items</label>
            <select
              v-model="filters.hasPayrollItems"
              class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:placeholder-gray-400 transition-colors duration-200 text-sm"
            >
              <option value="">All Employees</option>
              <option value="true">With Payroll Items</option>
              <option value="false">Without Payroll Items</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Employee List -->
    <div class="bg-white dark:bg-gray-800 shadow rounded-lg">
      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-lg font-medium text-gray-900 dark:text-white">Employees</h2>
      </div>

      <div v-if="loading" class="p-6">
        <div class="animate-pulse space-y-4">
          <div v-for="i in 5" :key="i" class="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>

      <div v-else-if="filteredEmployees.length === 0" class="p-6 text-center">
        <UserGroupIcon class="mx-auto h-12 w-12 text-gray-400" />
        <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">No employees found</h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Try adjusting your search criteria or add new employees.
        </p>
      </div>

      <div v-else class="divide-y divide-gray-200 dark:divide-gray-700">
        <div
          v-for="employee in filteredEmployees"
          :key="employee.uuid"
          class="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <div class="flex-shrink-0">
                <div class="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <span class="text-blue-600 dark:text-blue-300 font-medium text-sm">
                    {{ getInitials(employee.first_name, employee.last_name) }}
                  </span>
                </div>
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center space-x-2">
                  <h3 class="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {{ employee.display_name }}
                  </h3>
                  <span
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    :class="getStatusBadgeClass(employee.status)"
                  >
                    {{ employee.status }}
                  </span>
                </div>
                <div class="mt-1 flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                  <span>{{ employee.employee_id }}</span>
                  <span>{{ employee.position?.name }}</span>
                  <span>{{ employee.department?.name }}</span>
                  <span class="font-medium">{{ employee.formatted_salary }}</span>
                </div>
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <!-- Payroll Items Count -->
              <div class="text-center">
                <div class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ getEmployeePayrollItemsCount(employee.uuid) }}
                </div>
                <div class="text-xs text-gray-500 dark:text-gray-400">Items</div>
              </div>
              <button
                @click="openPayslipBuilder(employee)"
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
              >
                <CurrencyDollarIcon class="w-4 h-4 mr-2" />
                Manage Payroll
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="pagination.total > pagination.per_page" class="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <div class="text-sm text-gray-700 dark:text-gray-300">
            Showing {{ pagination.from }} to {{ pagination.to }} of {{ pagination.total }} employees
          </div>
          <div class="flex space-x-2">
            <button
              @click="previousPage"
              :disabled="!pagination.prev_page_url"
              class="px-3 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
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

    <!-- Payslip Builder Modal -->
    <PayslipBuilderModal
      :is-open="payslipBuilderOpen"
      :employee="selectedEmployee"
      @close="closePayslipBuilder"
      @saved="handlePayrollItemSaved"
    />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useApi } from '@/composables/useApi'
import { useNotifications } from '@/composables/useNotifications'
import {
  ArrowPathIcon,
  MagnifyingGlassIcon,
  UserGroupIcon,
  CurrencyDollarIcon
} from '@heroicons/vue/24/outline'
import PayslipBuilderModal from '@/components/payroll/PayslipBuilderModal.vue'

const { get } = useApi()
const { showNotification } = useNotifications()

// State
const loading = ref(false)
const employees = ref([])
const departments = ref([])
const payrollItems = ref([])
const payslipBuilderOpen = ref(false)
const selectedEmployee = ref(null)

const filters = reactive({
  search: '',
  department: '',
  status: '',
  hasPayrollItems: ''
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

  if (filters.search) {
    const search = filters.search.toLowerCase()
    filtered = filtered.filter(emp => 
      emp.display_name.toLowerCase().includes(search) ||
      emp.employee_id.toLowerCase().includes(search) ||
      emp.email.toLowerCase().includes(search)
    )
  }

  if (filters.department) {
    filtered = filtered.filter(emp => emp.department?.uuid === filters.department)
  }

  if (filters.status) {
    filtered = filtered.filter(emp => emp.status === filters.status)
  }

  if (filters.hasPayrollItems) {
    const hasItems = filters.hasPayrollItems === 'true'
    filtered = filtered.filter(emp => {
      const itemCount = getEmployeePayrollItemsCount(emp.uuid)
      return hasItems ? itemCount > 0 : itemCount === 0
    })
  }

  return filtered
})

// Methods
const loadEmployees = async () => {
  try {
    loading.value = true
    const response = await get('/employees', {
      per_page: pagination.per_page,
      page: pagination.current_page
    })
    
    employees.value = response.data.data
    Object.assign(pagination, response.data)
  } catch (error) {
    showNotification('Failed to load employees', 'error')
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

const loadPayrollItems = async () => {
  try {
    const response = await get('/employee-payroll-items')
    // Extract the actual items array from the paginated response
    payrollItems.value = response.data.data.data || []
  } catch (error) {
    console.error('Failed to load payroll items:', error)
    payrollItems.value = []
  }
}

const refreshData = async () => {
  await Promise.all([
    loadEmployees(),
    loadDepartments(),
    loadPayrollItems()
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

const getEmployeePayrollItemsCount = (employeeUuid) => {
  if (!Array.isArray(payrollItems.value)) {
    return 0
  }
  return payrollItems.value.filter(item => item.employee_uuid === employeeUuid).length
}

const openPayslipBuilder = (employee) => {
  selectedEmployee.value = employee
  payslipBuilderOpen.value = true
}

const closePayslipBuilder = () => {
  payslipBuilderOpen.value = false
  selectedEmployee.value = null
}

const handlePayrollItemSaved = () => {
  loadPayrollItems()
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

// Watchers
watch([filters], () => {
  // Reset pagination when filters change
  pagination.current_page = 1
}, { deep: true })

// Lifecycle
onMounted(() => {
  refreshData()
})
</script>