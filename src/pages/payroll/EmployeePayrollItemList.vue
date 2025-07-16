<template>
  <div class="min-h-screen bg-content-light dark:bg-content-dark transition-colors duration-200">
    <!-- Page Header -->
    <div class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Employee Payroll Items</h1>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage individual employee allowances and deductions</p>
          </div>
          <div class="flex items-center space-x-3">
            <button
              @click="showCreateModal = true"
              class="inline-flex items-center px-4 py-2 bg-blue-600 dark:bg-blue-700 border border-transparent rounded-lg text-sm font-medium text-white hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors duration-200"
            >
              <PlusIcon class="w-4 h-4 mr-2" />
              Add Item
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
              <DocumentIcon class="h-8 w-8 text-blue-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Total Items</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ pagination?.total || 0 }}</p>
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
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ activeItemsCount }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700 transition-colors duration-200">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <ClockIcon class="h-8 w-8 text-yellow-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Pending Approval</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ pendingApprovalCount }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700 transition-colors duration-200">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <PauseIcon class="h-8 w-8 text-red-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Suspended</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ suspendedCount }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters and Search -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6 transition-colors duration-200">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <!-- Employee Filter -->
          <div>
            <label for="employee" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Employee</label>
            <select
              v-model="filters.employee_uuid"
              id="employee"
              class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              @change="fetchItems"
            >
              <option value="">All Employees</option>
              <option
                v-for="employee in employees"
                :key="employee.uuid"
                :value="employee.uuid"
              >
                {{ employee.first_name }} {{ employee.last_name }}
              </option>
            </select>
          </div>

          <!-- Type Filter -->
          <div>
            <label for="type" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
            <select
              v-model="filters.type"
              id="type"
              class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              @change="fetchItems"
            >
              <option value="">All Types</option>
              <option value="allowance">Allowances</option>
              <option value="deduction">Deductions</option>
            </select>
          </div>

          <!-- Status Filter -->
          <div>
            <label for="status" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
            <select
              v-model="filters.status"
              id="status"
              class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              @change="fetchItems"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="pending_approval">Pending Approval</option>
              <option value="suspended">Suspended</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <!-- Search -->
          <div>
            <label for="search" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Search</label>
            <div class="relative">
              <MagnifyingGlassIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                v-model="searchQuery"
                type="text"
                id="search"
                placeholder="Search items..."
                class="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                @input="debouncedSearch"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Items Table -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors duration-200">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">Payroll Items</h3>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center items-center py-12">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>

        <!-- Items Table -->
        <div v-else-if="items && items.length > 0" class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Employee
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Item Details
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Amount/Method
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Effective Period
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr
                v-for="item in items"
                :key="item.uuid"
                class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                      <div class="h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                        <span class="text-sm font-medium text-gray-700 dark:text-gray-200">
                          {{ getInitials(item.employee?.first_name, item.employee?.last_name) }}
                        </span>
                      </div>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900 dark:text-white">
                        {{ item.employee?.first_name }} {{ item.employee?.last_name }}
                      </div>
                      <div class="text-sm text-gray-500 dark:text-gray-400">
                        {{ item.employee?.employee_id }}
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div>
                    <div class="flex items-center mb-1">
                      <span
                        :class="[
                          'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mr-2',
                          item.type === 'allowance'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        ]"
                      >
                        {{ item.type === 'allowance' ? 'Allowance' : 'Deduction' }}
                      </span>
                    </div>
                    <div class="text-sm font-medium text-gray-900 dark:text-white">
                      {{ item.name }}
                    </div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">
                      {{ item.code }}
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900 dark:text-white">
                    <div v-if="item.amount" class="font-medium">
                      {{ formatCurrency(item.amount) }}
                    </div>
                    <div v-if="item.percentage" class="font-medium">
                      {{ item.percentage }}%
                    </div>
                    <div class="text-xs text-gray-500 dark:text-gray-400">
                      {{ formatCalculationMethod(item.calculation_method) }}
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    :class="[
                      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                      getStatusClasses(item.status)
                    ]"
                  >
                    {{ formatStatus(item.status) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  <div>{{ formatDate(item.effective_from) }}</div>
                  <div v-if="item.effective_to" class="text-xs text-gray-500 dark:text-gray-400">
                    to {{ formatDate(item.effective_to) }}
                  </div>
                  <div v-else class="text-xs text-gray-500 dark:text-gray-400">
                    Ongoing
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex items-center space-x-2">
                    <button
                      @click="editItem(item)"
                      :disabled="!canEdit(item)"
                      class="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                      Edit
                    </button>
                    <button
                      @click="calculatePreview(item)"
                      class="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 transition-colors duration-200"
                    >
                      Test
                    </button>
                    <button
                      v-if="item.status === 'pending_approval'"
                      @click="approveItem(item)"
                      class="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300 transition-colors duration-200"
                    >
                      Approve
                    </button>
                    <button
                      v-if="item.status === 'active'"
                      @click="suspendItem(item)"
                      class="text-yellow-600 dark:text-yellow-400 hover:text-yellow-900 dark:hover:text-yellow-300 transition-colors duration-200"
                    >
                      Suspend
                    </button>
                    <button
                      @click="deleteItem(item)"
                      class="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 transition-colors duration-200"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-12">
          <DocumentIcon class="mx-auto h-12 w-12 text-gray-400" />
          <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">No items found</h3>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Add payroll items for employees to get started</p>
          <div class="mt-6">
            <button
              @click="showCreateModal = true"
              class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors duration-200"
            >
              <PlusIcon class="w-4 h-4 mr-2" />
              Add Item
            </button>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="pagination.total > 0" class="bg-white dark:bg-gray-800 px-6 py-3 border-t border-gray-200 dark:border-gray-700">
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div class="flex items-center space-x-4">
              <div class="text-sm text-gray-700 dark:text-gray-300">
                Showing {{ pagination.from || ((pagination.current_page - 1) * pagination.per_page + 1) }} to {{ pagination.to || Math.min(pagination.current_page * pagination.per_page, pagination.total) }} of {{ pagination.total }} results
              </div>
              <div class="flex items-center space-x-2">
                <label for="per-page-items" class="text-sm text-gray-700 dark:text-gray-300">
                  Show:
                </label>
                <select
                  id="per-page-items"
                  v-model="currentPerPage"
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
                @click="handlePageChange(pagination.current_page - 1)"
                :disabled="pagination.current_page <= 1"
                class="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200"
              >
                Previous
              </button>
              <span class="text-sm text-gray-700 dark:text-gray-300">
                Page {{ pagination.current_page }} of {{ pagination.last_page }}
              </span>
              <button
                @click="handlePageChange(pagination.current_page + 1)"
                :disabled="pagination.current_page >= pagination.last_page"
                class="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <EmployeePayrollItemModal
      v-if="showCreateModal || showEditModal"
      :is-open="showCreateModal || showEditModal"
      :item="editingItem"
      :employees="employees"
      @close="closeModal"
      @saved="handleItemSaved"
    />

    <CalculationPreviewModal
      v-if="showPreviewModal"
      :is-open="showPreviewModal"
      :item="previewingItem"
      @close="showPreviewModal = false"
    />

    <ApprovalModal
      v-if="showApprovalModal"
      :is-open="showApprovalModal"
      :item="approvingItem"
      @close="showApprovalModal = false"
      @approved="handleItemApproved"
    />

    <SuspensionModal
      v-if="showSuspensionModal"
      :is-open="showSuspensionModal"
      :item="suspendingItem"
      @close="showSuspensionModal = false"
      @suspended="handleItemSuspended"
    />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { debounce } from 'lodash-es'
import { useApi } from '@/composables/useApi'
import { useNotifications } from '@/composables/useNotifications'
import { formatCurrency } from '@/utils/currency'
import { formatDate } from '@/utils/date'
import {
  PlusIcon,
  DocumentIcon,
  CheckCircleIcon,
  ClockIcon,
  PauseIcon,
  MagnifyingGlassIcon
} from '@heroicons/vue/24/outline'
import EmployeePayrollItemModal from '@/components/payroll/EmployeePayrollItemModal.vue'
import CalculationPreviewModal from '@/components/payroll/CalculationPreviewModal.vue'
import ApprovalModal from '@/components/payroll/ApprovalModal.vue'
import SuspensionModal from '@/components/payroll/SuspensionModal.vue'

const { get, delete: deleteRequest } = useApi()
const { showNotification } = useNotifications()

// State
const loading = ref(false)
const items = ref([])
const employees = ref([])
const pagination = ref({
  current_page: 1,
  last_page: 1,
  total: 0,
  per_page: 15
})

const filters = reactive({
  employee_uuid: '',
  type: '',
  status: ''
})

const searchQuery = ref('')
const currentPerPage = ref(15)

// Methods
const fetchItems = async (page = 1) => {
  try {
    loading.value = true
    const params = {
      page,
      per_page: pagination.value.per_page,
      ...filters
    }

    if (searchQuery.value) {
      params.search = searchQuery.value
    }

    const response = await get('/employee-payroll-items', { params })
    
    // Laravel ResourceCollection returns data in 'data' and pagination in 'meta'
    console.log(response );
    items.value = response.data.data || []
    const meta = response.data.meta || {}
    pagination.value = {
      current_page: meta.current_page || 1,
      last_page: meta.last_page || 1,
      total: meta.total || 0,
      per_page: meta.per_page || 15,
      from: meta.from || 0,
      to: meta.to || 0
    }
  } catch (error) {
    items.value = [] // Ensure items is always an array
    showNotification('Error fetching payroll items', 'error')
    console.error('Error fetching items:', error)
  } finally {
    loading.value = false
  }
}

const fetchEmployees = async () => {
  try {
    const response = await get('/employees', {
      params: { per_page: 1000 } // Get all employees for filter
    })
    
    // Laravel ResourceCollection returns data in 'data'
    employees.value = response.data.data || []
  } catch (error) {
    employees.value = [] // Ensure employees is always an array
    console.error('Error fetching employees:', error)
  }
}

const debouncedSearch = debounce(() => {
  fetchItems()
}, 300)

// Modal states
const showCreateModal = ref(false)
const showEditModal = ref(false)
const showPreviewModal = ref(false)
const showApprovalModal = ref(false)
const showSuspensionModal = ref(false)

const editingItem = ref(null)
const previewingItem = ref(null)
const approvingItem = ref(null)
const suspendingItem = ref(null)

const handlePageChange = (page) => {
  fetchItems(page)
}

const changePerPage = () => {
  pagination.value.per_page = parseInt(currentPerPage.value)
  pagination.value.current_page = 1  // Reset to first page when changing per-page
  fetchItems(1)
}

const editItem = (item) => {
  editingItem.value = item
  showEditModal.value = true
}

const calculatePreview = (item) => {
  previewingItem.value = item
  showPreviewModal.value = true
}

const approveItem = (item) => {
  approvingItem.value = item
  showApprovalModal.value = true
}

const suspendItem = (item) => {
  suspendingItem.value = item
  showSuspensionModal.value = true
}

const deleteItem = async (item) => {
  if (!confirm(`Are you sure you want to delete "${item.name}"?`)) {
    return
  }

  try {
    await deleteRequest(`/employee-payroll-items/${item.uuid}`)
    showNotification('Item deleted successfully', 'success')
    fetchItems(pagination.value.current_page)
  } catch (error) {
    showNotification(
      error.response?.data?.message || 'Error deleting item',
      'error'
    )
    console.error('Error deleting item:', error)
  }
}

const closeModal = () => {
  showCreateModal.value = false
  showEditModal.value = false
  editingItem.value = null
}

const handleItemSaved = () => {
  closeModal()
  fetchItems(pagination.value.current_page)
  showNotification('Item saved successfully', 'success')
}

const handleItemApproved = () => {
  showApprovalModal.value = false
  approvingItem.value = null
  fetchItems(pagination.value.current_page)
  showNotification('Item approved successfully', 'success')
}

const handleItemSuspended = () => {
  showSuspensionModal.value = false
  suspendingItem.value = null
  fetchItems(pagination.value.current_page)
  showNotification('Item suspended successfully', 'success')
}

// Helper functions
const canEdit = (item) => {
  return ['active', 'pending_approval'].includes(item.status)
}

const formatCalculationMethod = (method) => {
  const methods = {
    fixed_amount: 'Fixed Amount',
    percentage_of_salary: 'Percentage of Salary',
    percentage_of_basic: 'Percentage of Basic',
    formula: 'Formula Based',
    manual: 'Manual'
  }
  return methods[method] || method
}

const formatStatus = (status) => {
  const statuses = {
    active: 'Active',
    pending_approval: 'Pending Approval',
    suspended: 'Suspended',
    cancelled: 'Cancelled'
  }
  return statuses[status] || status
}

const getStatusClasses = (status) => {
  const classes = {
    active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    pending_approval: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    suspended: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    cancelled: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
  }
  return classes[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
}

const getInitials = (firstName, lastName) => {
  return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase()
}

// Computed statistics
const activeItemsCount = computed(() => {
  return Array.isArray(items.value) ? items.value.filter(item => item.status === 'active').length : 0
})

const pendingApprovalCount = computed(() => {
  return Array.isArray(items.value) ? items.value.filter(item => item.status === 'pending_approval').length : 0
})

const suspendedCount = computed(() => {
  return Array.isArray(items.value) ? items.value.filter(item => item.status === 'suspended').length : 0
})

onMounted(() => {
  fetchItems()
  fetchEmployees()
})
</script>