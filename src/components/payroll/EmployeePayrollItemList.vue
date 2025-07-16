<template>
  <div class="employee-payroll-item-list">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          Employee Payroll Items
        </h1>
        <p class="text-gray-600 dark:text-gray-400 mt-1">
          Manage individual employee allowances and deductions
        </p>
      </div>
      <button
        @click="showCreateModal = true"
        class="btn btn-primary"
      >
        <PlusIcon class="w-5 h-5 mr-2" />
        Add Item
      </button>
    </div>

    <!-- Filters -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Employee
          </label>
          <select
            v-model="filters.employee_uuid"
            @change="fetchItems"
            class="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
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
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Type
          </label>
          <select
            v-model="filters.type"
            @change="fetchItems"
            class="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
          >
            <option value="">All Types</option>
            <option value="allowance">Allowances</option>
            <option value="deduction">Deductions</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Status
          </label>
          <select
            v-model="filters.status"
            @change="fetchItems"
            class="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="pending_approval">Pending Approval</option>
            <option value="suspended">Suspended</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Search
          </label>
          <input
            v-model="searchQuery"
            @input="debouncedSearch"
            type="text"
            placeholder="Search items..."
            class="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
          >
        </div>
      </div>
    </div>

    <!-- Items Table -->
    <div class="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
      <div v-if="loading" class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
        <p class="text-gray-600 dark:text-gray-400 mt-4">Loading items...</p>
      </div>

      <div v-else-if="items.length === 0" class="text-center py-12">
        <DocumentIcon class="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No items found
        </h3>
        <p class="text-gray-600 dark:text-gray-400 mb-6">
          Add payroll items for employees to get started
        </p>
        <button
          @click="showCreateModal = true"
          class="btn btn-primary"
        >
          Add Item
        </button>
      </div>

      <div v-else class="overflow-x-auto">
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
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr
              v-for="item in items"
              :key="item.uuid"
              class="hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div>
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
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="relative inline-block text-left">
                  <button
                    @click="toggleDropdown(item.uuid)"
                    class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  >
                    <EllipsisVerticalIcon class="w-5 h-5" />
                  </button>
                  <div
                    v-if="activeDropdown === item.uuid"
                    class="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-700 rounded-md shadow-lg z-10"
                  >
                    <div class="py-1">
                      <button
                        @click="editItem(item)"
                        :disabled="!canEdit(item)"
                        class="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Edit Item
                      </button>
                      <button
                        @click="calculatePreview(item)"
                        class="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
                      >
                        Test Calculation
                      </button>
                      <button
                        v-if="item.status === 'pending_approval'"
                        @click="approveItem(item)"
                        class="block w-full text-left px-4 py-2 text-sm text-green-600 dark:text-green-400 hover:bg-gray-100 dark:hover:bg-gray-600"
                      >
                        Approve
                      </button>
                      <button
                        v-if="item.status === 'active'"
                        @click="suspendItem(item)"
                        class="block w-full text-left px-4 py-2 text-sm text-yellow-600 dark:text-yellow-400 hover:bg-gray-100 dark:hover:bg-gray-600"
                      >
                        Suspend
                      </button>
                      <button
                        @click="deleteItem(item)"
                        class="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-600"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="pagination.total > 0" class="mt-8">
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
        <div class="flex items-center space-x-2">
          <label for="per-page-component-items" class="text-sm text-gray-700 dark:text-gray-300">
            Show:
          </label>
          <select
            id="per-page-component-items"
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
      <Pagination
        v-if="pagination.last_page > 1"
        :current-page="pagination.current_page"
        :total-pages="pagination.last_page"
        :total-items="pagination.total"
        :per-page="pagination.per_page"
        @page-change="handlePageChange"
      />
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

<script>
import { ref, reactive, onMounted } from 'vue'
import { useApi } from '@/composables/useApi'
import { useNotifications } from '@/composables/useNotifications'
import { useDebouncedRef } from '@/composables/useDebouncedRef'
import { formatCurrency } from '@/utils/currency'
import { formatDate } from '@/utils/date'
import {
  PlusIcon,
  DocumentIcon,
  EllipsisVerticalIcon
} from '@heroicons/vue/24/outline'
import Pagination from '@/components/shared/Pagination.vue'
import EmployeePayrollItemModal from './EmployeePayrollItemModal.vue'
import CalculationPreviewModal from './CalculationPreviewModal.vue'
import ApprovalModal from './ApprovalModal.vue'
import SuspensionModal from './SuspensionModal.vue'

export default {
  name: 'EmployeePayrollItemList',
  components: {
    PlusIcon,
    DocumentIcon,
    EllipsisVerticalIcon,
    Pagination,
    EmployeePayrollItemModal,
    CalculationPreviewModal,
    ApprovalModal,
    SuspensionModal
  },
  setup() {
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
        console.log(object.keys(response.data.data));
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
        employees.value = response.data.data
      } catch (error) {
        console.error('Error fetching employees:', error)
      }
    }

    const debouncedSearch = useDebouncedRef(searchQuery, 300, fetchItems)

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

    // Dropdown state
    const activeDropdown = ref(null)

    const handlePageChange = (page) => {
      fetchItems(page)
    }

    const changePerPage = () => {
      pagination.value.per_page = parseInt(currentPerPage.value)
      pagination.value.current_page = 1  // Reset to first page when changing per-page
      fetchItems(1)
    }

    const toggleDropdown = (itemId) => {
      activeDropdown.value = activeDropdown.value === itemId ? null : itemId
    }

    const editItem = (item) => {
      editingItem.value = item
      showEditModal.value = true
      activeDropdown.value = null
    }

    const calculatePreview = (item) => {
      previewingItem.value = item
      showPreviewModal.value = true
      activeDropdown.value = null
    }

    const approveItem = (item) => {
      approvingItem.value = item
      showApprovalModal.value = true
      activeDropdown.value = null
    }

    const suspendItem = (item) => {
      suspendingItem.value = item
      showSuspensionModal.value = true
      activeDropdown.value = null
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
      activeDropdown.value = null
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

    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (!event.target.closest('.relative')) {
        activeDropdown.value = null
      }
    }

    onMounted(() => {
      fetchItems()
      fetchEmployees()
      document.addEventListener('click', handleClickOutside)
    })

    return {
      loading,
      items,
      employees,
      pagination,
      filters,
      searchQuery,
      currentPerPage,
      debouncedSearch,
      showCreateModal,
      showEditModal,
      showPreviewModal,
      showApprovalModal,
      showSuspensionModal,
      editingItem,
      previewingItem,
      approvingItem,
      suspendingItem,
      activeDropdown,
      fetchItems,
      handlePageChange,
      changePerPage,
      toggleDropdown,
      editItem,
      calculatePreview,
      approveItem,
      suspendItem,
      deleteItem,
      closeModal,
      handleItemSaved,
      handleItemApproved,
      handleItemSuspended,
      canEdit,
      formatCalculationMethod,
      formatStatus,
      getStatusClasses,
      formatCurrency,
      formatDate
    }
  }
}
</script>

<style scoped>
.btn {
  @apply inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors;
}

.btn-primary {
  @apply text-white bg-primary-600 hover:bg-primary-700 focus:ring-primary-500;
}
</style>