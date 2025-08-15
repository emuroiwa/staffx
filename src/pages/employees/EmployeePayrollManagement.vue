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
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Payslip Status</label>
            <select
              v-model="filters.payslipStatus"
              class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:placeholder-gray-400 transition-colors duration-200 text-sm"
            >
              <option value="">All Statuses</option>
              <option value="draft">Draft</option>
              <option value="in_progress">In Progress</option>
              <option value="finalized">Finalized</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Bulk Actions -->
    <div class="bg-white dark:bg-gray-800 shadow rounded-lg">
      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-medium text-gray-900 dark:text-white">Bulk Actions</h2>
          <div class="flex items-center space-x-2">
            <span class="text-sm text-gray-500 dark:text-gray-400">
              {{ selectedEmployees.length }} selected
            </span>
          </div>
        </div>
      </div>
      
      <div class="px-6 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <label class="flex items-center space-x-2">
              <input
                type="checkbox"
                :checked="selectAll"
                @change="toggleSelectAll"
                class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
                Select All
              </span>
            </label>
            
            <div class="flex space-x-2">
              <button
                v-if="selectedEmployees.length > 0"
                @click="openBulkFinalizationModal"
                :disabled="bulkProcessing"
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
              >
                <CheckIcon class="w-4 h-4 mr-2" />
                Finalize Selected ({{ selectedEmployees.length }})
              </button>
              
              <button
                v-if="selectedEmployees.length > 0"
                @click="bulkSetInProgress"
                :disabled="bulkProcessing"
                class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                <PencilIcon class="w-4 h-4 mr-2" />
                Set In Progress
              </button>
            </div>
          </div>
          
          <div class="flex space-x-2">
            <button
              @click="filterByStatus('draft')"
              :class="[
                'px-3 py-1 rounded-full text-sm font-medium transition-colors',
                filters.payslipStatus === 'draft' 
                  ? 'bg-red-100 text-red-800 border-red-200' 
                  : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'
              ]"
            >
              Draft ({{ statusCounts.draft || 0 }})
            </button>
            <button
              @click="filterByStatus('in_progress')"
              :class="[
                'px-3 py-1 rounded-full text-sm font-medium transition-colors',
                filters.payslipStatus === 'in_progress' 
                  ? 'bg-yellow-100 text-yellow-800 border-yellow-200' 
                  : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'
              ]"
            >
              In Progress ({{ statusCounts.in_progress || 0 }})
            </button>
            <button
              @click="filterByStatus('finalized')"
              :class="[
                'px-3 py-1 rounded-full text-sm font-medium transition-colors',
                filters.payslipStatus === 'finalized' 
                  ? 'bg-green-100 text-green-800 border-green-200' 
                  : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'
              ]"
            >
              Finalized ({{ statusCounts.finalized || 0 }})
            </button>
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

      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                <input
                  type="checkbox"
                  :checked="selectAll"
                  @change="toggleSelectAll"
                  class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </th>
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
                Payroll Items
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Payslip Status
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
              <!-- Checkbox Column -->
              <td class="px-6 py-4 whitespace-nowrap">
                <input
                  type="checkbox"
                  :value="employee.uuid"
                  v-model="selectedEmployees"
                  class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </td>
              
              <!-- Employee Column -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <div class="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                      <span class="text-blue-600 dark:text-blue-300 font-medium text-sm">
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
              
              <!-- Salary Column -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ employee.formatted_salary || '-' }}
                </div>
              </td>
              
              <!-- Payroll Items Column -->
              <td class="px-6 py-4 whitespace-nowrap text-center">
                <div class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                     :class="getPayrollItemsBadgeClass(getEmployeePayrollItemsCount(employee.uuid))">
                  {{ getEmployeePayrollItemsCount(employee.uuid) }} Items
                </div>
              </td>
              
              <!-- Payslip Status Column -->
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="getPayslipStatusBadgeClass(getEmployeePayslipStatus(employee.uuid))"
                >
                  {{ getEmployeePayslipStatus(employee.uuid) }}
                </span>
              </td>
              
              <!-- Actions Column -->
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  @click="openPayslipBuilder(employee)"
                  class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                >
                  <CurrencyDollarIcon class="w-4 h-4 mr-2" />
                  Manage Payroll
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
              <span v-if="!filters.hasPayrollItems">
                Showing {{ pagination.from }} to {{ pagination.to }} of {{ pagination.total }} employees
              </span>
              <span v-else>
                Showing {{ filteredEmployees.length }} employees (filtered)
              </span>
            </div>
            <div class="flex items-center space-x-2">
              <label for="per-page-payroll" class="text-sm text-gray-700 dark:text-gray-300">
                Show:
              </label>
              <select
                id="per-page-payroll"
                v-model="pagination.per_page"
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
          <div v-if="!filters.hasPayrollItems && pagination.total > pagination.per_page" class="flex space-x-2">
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

    <!-- Payslip Builder Modal -->
    <PayslipBuilderModal
      :is-open="payslipBuilderOpen"
      :employee="selectedEmployee"
      @close="closePayslipBuilder"
      @saved="handlePayrollItemSaved"
    />
    
    <!-- Payslip Finalization Modal -->
    <PayslipFinalizationModal
      :is-open="finalizationModalOpen"
      :employee-uuids="selectedEmployees"
      @close="closeFinalizationModal"
      @finalized="handlePayslipsFinalized"
    />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useApi } from '@/composables/useApi'
import { useNotifications } from '@/composables/useNotifications'
import {
  ArrowPathIcon,
  MagnifyingGlassIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  CheckIcon,
  PencilIcon
} from '@heroicons/vue/24/outline'
import PayslipBuilderModal from '@/components/payroll/PayslipBuilderModal.vue'
import PayslipFinalizationModal from '@/components/payroll/PayslipFinalizationModal.vue'
import { payslipApi } from '@/services/payslipApi'

const { get } = useApi()
const { showNotification } = useNotifications()
const route = useRoute()

// State
const loading = ref(false)
const employees = ref([])
const departments = ref([])
const payrollItems = ref([])
const payslipBuilderOpen = ref(false)
const selectedEmployee = ref(null)
const finalizationModalOpen = ref(false)
const selectedEmployees = ref([])
const bulkProcessing = ref(false)
const statusCounts = ref({
  draft: 0,
  in_progress: 0,
  finalized: 0
})

const filters = reactive({
  search: '',
  department: '',
  status: '',
  hasPayrollItems: '',
  payslipStatus: ''
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

// Computed - only handles client-side filters that can't be done server-side
const filteredEmployees = computed(() => {
  let filtered = employees.value

  // Only apply payroll items filter client-side since it requires counting related data
  if (filters.hasPayrollItems) {
    const hasItems = filters.hasPayrollItems === 'true'
    filtered = filtered.filter(emp => {
      const itemCount = getEmployeePayrollItemsCount(emp.uuid)
      return hasItems ? itemCount > 0 : itemCount === 0
    })
  }

  // Apply payslip status filter client-side
  if (filters.payslipStatus) {
    filtered = filtered.filter(emp => {
      const status = getEmployeePayslipStatus(emp.uuid)
      return status === filters.payslipStatus
    })
  }

  return filtered
})

// Computed for select all checkbox
const selectAll = computed(() => {
  return filteredEmployees.value.length > 0 && selectedEmployees.value.length === filteredEmployees.value.length
})

// Methods
const loadEmployees = async () => {
  try {
    loading.value = true
    
    // Build API parameters including filters
    const params = {
      per_page: pagination.per_page,
      page: pagination.current_page
    }
    
    // Add search filter
    if (filters.search) {
      params.search = filters.search
    }
    
    // Add department filter  
    if (filters.department) {
      params.department_uuid = filters.department
    }
    
    // Add status filter
    if (filters.status) {
      params.status = filters.status
    }
    
    const response = await get('/employees', params)
    
    employees.value = response.data.data || []
    
    // Laravel ResourceCollection returns pagination data in 'meta' object
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

const getPayrollItemsBadgeClass = (count) => {
  if (count === 0) {
    return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
  } else if (count <= 3) {
    return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
  } else if (count <= 6) {
    return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
  } else {
    return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
  }
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

// New methods for payslip finalization
const getEmployeePayslipStatus = (employeeUuid) => {
  // This would normally come from the employee's payroll data
  // For now, we'll return a random status for demonstration
  const statuses = ['draft', 'in_progress', 'finalized']
  return statuses[Math.floor(Math.random() * statuses.length)]
}

const getPayslipStatusBadgeClass = (status) => {
  const classes = {
    draft: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    in_progress: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    finalized: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
  }
  return classes[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
}

const toggleSelectAll = () => {
  if (selectAll.value) {
    selectedEmployees.value = []
  } else {
    selectedEmployees.value = filteredEmployees.value.map(emp => emp.uuid)
  }
}

const filterByStatus = (status) => {
  if (filters.payslipStatus === status) {
    filters.payslipStatus = ''
  } else {
    filters.payslipStatus = status
  }
}

const openBulkFinalizationModal = () => {
  if (selectedEmployees.value.length === 0) {
    showNotification('Please select employees to finalize', 'error')
    return
  }
  finalizationModalOpen.value = true
}

const closeFinalizationModal = () => {
  finalizationModalOpen.value = false
}

const handlePayslipsFinalized = (finalizedCount) => {
  showNotification(`Successfully finalized ${finalizedCount} payslips`, 'success')
  selectedEmployees.value = []
  refreshData()
}

const bulkSetInProgress = async () => {
  if (selectedEmployees.value.length === 0) {
    showNotification('Please select employees', 'error')
    return
  }
  
  try {
    bulkProcessing.value = true
    
    // Get payroll UUIDs for selected employees
    const payrollUuids = selectedEmployees.value.map(empUuid => {
      // This would normally come from the employee's payroll data
      // For now, we'll use the employee UUID as a placeholder
      return empUuid
    })
    
    let successCount = 0
    for (const payrollUuid of payrollUuids) {
      try {
        await payslipApi.setInProgress(payrollUuid)
        successCount++
      } catch (error) {
        console.error('Error setting payslip in progress:', error)
      }
    }
    
    showNotification(`Successfully set ${successCount} payslips to in progress`, 'success')
    selectedEmployees.value = []
    refreshData()
  } catch (error) {
    showNotification('Failed to update payslip status', 'error')
  } finally {
    bulkProcessing.value = false
  }
}

const updateStatusCounts = () => {
  statusCounts.value = {
    draft: filteredEmployees.value.filter(emp => getEmployeePayslipStatus(emp.uuid) === 'draft').length,
    in_progress: filteredEmployees.value.filter(emp => getEmployeePayslipStatus(emp.uuid) === 'in_progress').length,
    finalized: filteredEmployees.value.filter(emp => getEmployeePayslipStatus(emp.uuid) === 'finalized').length
  }
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
  pagination.current_page = 1  // Reset to first page when changing per-page
  loadEmployees()
}

// Watchers
watch([filters], () => {
  // Reset pagination when filters change and reload data
  pagination.current_page = 1
  loadEmployees()
}, { deep: true })

// Watch for route query parameters (for status filtering from links)
watch(() => route.query, (newQuery) => {
  if (newQuery.payslip_status) {
    filters.payslipStatus = newQuery.payslip_status
  }
  if (newQuery.pay_frequency) {
    // Filter by pay frequency if needed
    // This would need to be implemented based on your employee data structure
  }
}, { immediate: true })

// Watch filtered employees to update status counts
watch(filteredEmployees, () => {
  updateStatusCounts()
}, { deep: true })

// Lifecycle
onMounted(() => {
  refreshData()
})
</script>