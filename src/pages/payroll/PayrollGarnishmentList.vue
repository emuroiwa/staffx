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
            <select
              v-model="selectedEmployeeUuid"
              @change="onEmployeeChange"
              class="px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-red-500 focus:border-red-500 text-sm"
            >
              <option value="">Select an employee</option>
              <option v-for="employee in employees" :key="employee.uuid" :value="employee.uuid">
                {{ employee.display_name }} ({{ employee.employee_id }})
              </option>
            </select>
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
                placeholder="Search garnishments..."
                class="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-red-500 focus:border-red-500 transition-colors duration-200"
              />
            </div>
          </div>

          <!-- Type Filter -->
          <div>
            <label for="type" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
            <select
              v-model="filters.type"
              id="type"
              class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-red-500 focus:border-red-500 transition-colors duration-200"
            >
              <option value="">All Types</option>
              <option v-for="(label, value) in garnishmentTypes" :key="value" :value="value">
                {{ label }}
              </option>
            </select>
          </div>

          <!-- Status Filter -->
          <div>
            <label for="status" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
            <select
              v-model="filters.status"
              id="status"
              class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-red-500 focus:border-red-500 transition-colors duration-200"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="pending_approval">Pending Approval</option>
              <option value="suspended">Suspended</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <!-- Employee Filter -->
          <div>
            <label for="employee" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Employee</label>
            <select
              v-model="filters.employee_uuid"
              id="employee"
              class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-red-500 focus:border-red-500 transition-colors duration-200"
            >
              <option value="">All Employees</option>
              <option v-for="employee in employees" :key="employee.uuid" :value="employee.uuid">
                {{ employee.display_name }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <!-- Content Based on Selection -->
      <div v-if="selectedEmployeeUuid && selectedEmployee">
        <!-- Employee Info Header -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6 transition-colors duration-200">
          <div class="flex items-center space-x-4">
            <div class="h-12 w-12 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
              <span class="text-red-600 dark:text-red-300 font-medium text-sm">
                {{ getInitials(selectedEmployee.first_name, selectedEmployee.last_name) }}
              </span>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                {{ selectedEmployee.display_name }}
              </h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                {{ selectedEmployee.employee_id }} • {{ selectedEmployee.position?.name }} • {{ selectedEmployee.department?.name }}
              </p>
            </div>
          </div>
        </div>

        <!-- Garnishment List Component -->
        <GarnishmentList
          :employee-uuid="selectedEmployeeUuid"
          @garnishment-updated="handleGarnishmentUpdated"
        />
      </div>

      <!-- Default State -->
      <div v-else class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center transition-colors duration-200">
        <ScaleIcon class="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Garnishment Management</h3>
        <p class="text-sm text-gray-500 dark:text-gray-400 mb-6">
          Select an employee from the dropdown above to view and manage their garnishments.
        </p>
        <div class="text-sm text-gray-500 dark:text-gray-400">
          <p>Garnishments are court-ordered deductions that must be processed with legal compliance.</p>
          <p class="mt-2">This includes child support, tax levies, wage garnishments, and other legal deductions.</p>
        </div>
      </div>

      <!-- Company-wide Garnishment Statistics -->
      <div v-if="!selectedEmployeeUuid" class="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors duration-200">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">Company Overview</h3>
        </div>
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="text-center">
              <div class="text-2xl font-bold text-gray-900 dark:text-white">{{ statistics.employees_with_garnishments || 0 }}</div>
              <div class="text-sm text-gray-500 dark:text-gray-400">Employees with Garnishments</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-gray-900 dark:text-white">{{ statistics.average_garnishment_amount || 0 }}</div>
              <div class="text-sm text-gray-500 dark:text-gray-400">Average Garnishment</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-gray-900 dark:text-white">{{ statistics.pending_approvals || 0 }}</div>
              <div class="text-sm text-gray-500 dark:text-gray-400">Pending Approvals</div>
            </div>
          </div>
        </div>
      </div>
    </div>
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
  MagnifyingGlassIcon
} from '@heroicons/vue/24/outline'
import GarnishmentList from '@/components/payroll/GarnishmentList.vue'

const { get } = useApi()
const { showNotification } = useNotifications()

// State
const loading = ref(false)
const employees = ref([])
const selectedEmployeeUuid = ref('')
const selectedEmployee = ref(null)
const garnishmentTypes = ref({})
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
  type: '',
  status: '',
  employee_uuid: ''
})

// Computed
const filteredEmployees = computed(() => {
  let filtered = employees.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(employee =>
      employee.display_name.toLowerCase().includes(query) ||
      employee.employee_id.toLowerCase().includes(query)
    )
  }

  return filtered
})

// Methods
const fetchEmployees = async () => {
  try {
    loading.value = true
    const response = await get('/employees', {
      params: {
        include: 'position,department',
        per_page: 1000 // Get all employees for dropdown
      }
    })
    employees.value = response.data.data.data || []
  } catch (error) {
    showNotification('Error fetching employees', 'error')
    console.error('Error fetching employees:', error)
  } finally {
    loading.value = false
  }
}

const fetchGarnishmentOptions = async () => {
  try {
    const response = await get('/garnishments/options')
    garnishmentTypes.value = response.data.data.garnishment_types || {}
  } catch (error) {
    showNotification('Error fetching garnishment options', 'error')
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

const onEmployeeChange = () => {
  selectedEmployee.value = employees.value.find(emp => emp.uuid === selectedEmployeeUuid.value)
}

const handleGarnishmentUpdated = () => {
  fetchStatistics()
}

const getInitials = (firstName, lastName) => {
  return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase()
}

// Watchers
watch(() => filters.employee_uuid, (newValue) => {
  if (newValue) {
    selectedEmployeeUuid.value = newValue
    onEmployeeChange()
  }
})

onMounted(() => {
  fetchEmployees()
  fetchGarnishmentOptions()
  fetchStatistics()
})
</script>